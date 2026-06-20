import { Injectable, BadRequestException } from '@nestjs/common';
import { IDeviceBindingStrategy } from '../../interfaces/device-binding.interface';
import { DeviceType } from '../../dto/login.dto';
import { WebDeviceStrategy } from './web-device.strategy';
import { MobileDeviceStrategy } from './mobile-device.strategy';

@Injectable()
export class DeviceBindingFactory {
  constructor(
    private readonly webDeviceStrategy: WebDeviceStrategy,
    private readonly mobileDeviceStrategy: MobileDeviceStrategy,
  ) {}

  getStrategy(deviceType: DeviceType): IDeviceBindingStrategy {
    switch (deviceType) {
      case DeviceType.WEB:
      case DeviceType.DESKTOP:
        return this.webDeviceStrategy;

      case DeviceType.ANDROID:
      case DeviceType.IOS:
      case DeviceType.TABLET:
        return this.mobileDeviceStrategy;

      default:
        throw new BadRequestException(`Unsupported device type: ${deviceType}`);
    }
  }
}
