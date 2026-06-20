import { Injectable, Logger } from '@nestjs/common';
import { IDeviceBindingStrategy, DeviceBindingResult } from '../../interfaces/device-binding.interface';
import { DeviceInfoDto } from '../../dto/login.dto';
import { UserDevice } from '../../../../database/models/user-device.model';
import * as crypto from 'crypto';

@Injectable()
export class WebDeviceStrategy implements IDeviceBindingStrategy {
  private readonly logger = new Logger(WebDeviceStrategy.name);

  async bind(userId: string, deviceInfo: DeviceInfoDto, sessionId: string): Promise<DeviceBindingResult> {
    const fingerprint = this.generateFingerprint(deviceInfo);

    // Check if device already exists
    let device = await UserDevice.query()
      .where('user_id', userId)
      .where('fingerprint', fingerprint)
      .whereNull('deleted_at')
      .first();

    const isNewDevice = !device;

    if (!device) {
      // Create new device
      device = await UserDevice.query().insert({
        user_id: userId,
        device_type: deviceInfo.device_type,
        device_id: deviceInfo.device_id,
        device_name: deviceInfo.device_name || this.generateDeviceName(deviceInfo),
        fingerprint,
        os_type: 'web',
        os_version: deviceInfo.os_version,
        browser: deviceInfo.browser,
        browser_version: deviceInfo.browser_version,
        user_agent: deviceInfo.user_agent,
        screen_width: deviceInfo.screen_resolution?.width,
        screen_height: deviceInfo.screen_resolution?.height,
        registration_ip: deviceInfo.ip_address,
        last_ip_address: deviceInfo.ip_address,
        is_trusted: false,
        is_active: true,
        login_count: 1,
        last_login_at: new Date(),
      });

      this.logger.log(`New web device created for user ${userId}: ${device.id}`);
    } else {
      // Update existing device
      await device.$query().patch({
        last_ip_address: deviceInfo.ip_address,
        last_login_at: new Date(),
        login_count: device.login_count + 1,
        user_agent: deviceInfo.user_agent,
      });

      this.logger.log(`Existing web device updated for user ${userId}: ${device.id}`);
    }

    // Calculate risk score
    const riskScore = await this.calculateRiskScore(device, deviceInfo);

    return {
      device,
      is_new_device: isNewDevice,
      is_trusted: device.is_trusted || false,
      risk_score: riskScore,
    };
  }

  async validateDevice(device: UserDevice): Promise<boolean> {
    // Check if device is active and not blocked
    if (!device.is_active || device.is_blocked) {
      return false;
    }

    // Check if device hasn't been used for too long (e.g., 90 days)
    if (device.last_login_at) {
      const daysSinceLastLogin = Math.floor(
        (Date.now() - new Date(device.last_login_at).getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysSinceLastLogin > 90) {
        return false;
      }
    }

    return true;
  }

  generateFingerprint(deviceInfo: DeviceInfoDto): string {
    // Generate a unique fingerprint based on device characteristics
    const components = [
      deviceInfo.device_id,
      deviceInfo.browser || '',
      deviceInfo.browser_version || '',
      deviceInfo.os_version || '',
      deviceInfo.screen_resolution?.width || '',
      deviceInfo.screen_resolution?.height || '',
    ];

    const fingerprintString = components.join('|');
    return crypto.createHash('sha256').update(fingerprintString).digest('hex');
  }

  private generateDeviceName(deviceInfo: DeviceInfoDto): string {
    const browser = deviceInfo.browser || 'Unknown Browser';
    const os = deviceInfo.os_version || 'Unknown OS';
    return `${browser} on ${os}`;
  }

  private async calculateRiskScore(device: UserDevice, deviceInfo: DeviceInfoDto): Promise<number> {
    let riskScore = 0;

    // New device increases risk
    if (!device.id) {
      riskScore += 30;
    }

    // IP address change increases risk
    if (device.last_ip_address && device.last_ip_address !== deviceInfo.ip_address) {
      riskScore += 20;
    }

    // First login on device
    if (device.login_count === 1) {
      riskScore += 15;
    }

    // Browser fingerprint mismatch
    const currentFingerprint = this.generateFingerprint(deviceInfo);
    if (device.fingerprint !== currentFingerprint) {
      riskScore += 25;
    }

    // Trusted device reduces risk
    if (device.is_trusted) {
      riskScore = Math.max(0, riskScore - 40);
    }

    // High login count reduces risk
    if (device.login_count > 50) {
      riskScore = Math.max(0, riskScore - 20);
    }

    return Math.min(100, riskScore);
  }
}
