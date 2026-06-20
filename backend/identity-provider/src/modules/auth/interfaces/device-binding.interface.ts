import { DeviceInfoDto } from '../dto/login.dto';
import { UserDevice } from '../../../database/models/user-device.model';

export interface DeviceBindingResult {
  device: UserDevice;
  is_new_device: boolean;
  is_trusted: boolean;
  risk_score?: number;
}

export interface IDeviceBindingStrategy {
  bind(userId: string, deviceInfo: DeviceInfoDto, sessionId: string): Promise<DeviceBindingResult>;
  validateDevice(device: UserDevice): Promise<boolean>;
  generateFingerprint(deviceInfo: DeviceInfoDto): string;
}
