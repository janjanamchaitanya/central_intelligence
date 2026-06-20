import { Injectable, Logger } from '@nestjs/common';
import { IDeviceBindingStrategy, DeviceBindingResult } from '../../interfaces/device-binding.interface';
import { DeviceInfoDto } from '../../dto/login.dto';
import { UserDevice } from '../../../../database/models/user-device.model';
import * as crypto from 'crypto';

@Injectable()
export class MobileDeviceStrategy implements IDeviceBindingStrategy {
  private readonly logger = new Logger(MobileDeviceStrategy.name);

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
        os_type: deviceInfo.device_type, // android or ios
        os_version: deviceInfo.os_version,
        app_version: deviceInfo.app_version,
        user_agent: deviceInfo.user_agent,
        screen_width: deviceInfo.screen_resolution?.width,
        screen_height: deviceInfo.screen_resolution?.height,
        registration_ip: deviceInfo.ip_address,
        last_ip_address: deviceInfo.ip_address,
        latitude: deviceInfo.location?.latitude,
        longitude: deviceInfo.location?.longitude,
        is_trusted: false,
        is_active: true,
        login_count: 1,
        last_login_at: new Date(),
      });

      this.logger.log(`New mobile device created for user ${userId}: ${device.id}`);
    } else {
      // Update existing device
      await device.$query().patch({
        last_ip_address: deviceInfo.ip_address,
        last_login_at: new Date(),
        login_count: device.login_count + 1,
        latitude: deviceInfo.location?.latitude,
        longitude: deviceInfo.location?.longitude,
        app_version: deviceInfo.app_version,
      });

      this.logger.log(`Existing mobile device updated for user ${userId}: ${device.id}`);
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

    // Mobile devices should be validated more strictly
    // Check if device hasn't been used for too long (e.g., 60 days)
    if (device.last_login_at) {
      const daysSinceLastLogin = Math.floor(
        (Date.now() - new Date(device.last_login_at).getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysSinceLastLogin > 60) {
        return false;
      }
    }

    return true;
  }

  generateFingerprint(deviceInfo: DeviceInfoDto): string {
    // For mobile devices, use device_id as primary identifier
    // as it's more reliable (device UUID, IMEI, etc.)
    const components = [
      deviceInfo.device_id,
      deviceInfo.device_type,
      deviceInfo.os_version || '',
    ];

    const fingerprintString = components.join('|');
    return crypto.createHash('sha256').update(fingerprintString).digest('hex');
  }

  private generateDeviceName(deviceInfo: DeviceInfoDto): string {
    const platform = deviceInfo.device_type === 'android' ? 'Android' : 'iOS';
    const os = deviceInfo.os_version || 'Unknown Version';
    return `${platform} ${os}`;
  }

  private async calculateRiskScore(device: UserDevice, deviceInfo: DeviceInfoDto): Promise<number> {
    let riskScore = 0;

    // New device increases risk
    if (!device.id) {
      riskScore += 25;
    }

    // IP address change increases risk
    if (device.last_ip_address && device.last_ip_address !== deviceInfo.ip_address) {
      riskScore += 15;
    }

    // Location change (if available)
    if (deviceInfo.location && device.latitude && device.longitude) {
      const distance = this.calculateDistance(
        device.latitude,
        device.longitude,
        deviceInfo.location.latitude!,
        deviceInfo.location.longitude!,
      );

      // Significant location change (> 100km)
      if (distance > 100) {
        riskScore += 20;
      }
    }

    // First login on device
    if (device.login_count === 1) {
      riskScore += 15;
    }

    // App version mismatch
    if (device.app_version && device.app_version !== deviceInfo.app_version) {
      riskScore += 5;
    }

    // Trusted device reduces risk
    if (device.is_trusted) {
      riskScore = Math.max(0, riskScore - 40);
    }

    // High login count reduces risk
    if (device.login_count > 30) {
      riskScore = Math.max(0, riskScore - 15);
    }

    return Math.min(100, riskScore);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula to calculate distance between two coordinates
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
