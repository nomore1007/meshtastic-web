import {
  IConnection,
  Protobuf,
  SettingsManager,
  Types,
} from "@meshtastic/meshtasticjs";

import type { Device } from "./stores/deviceStore.js";

export const subscribeAll = (device: Device, connection: IConnection) => {
  SettingsManager.debugMode = Protobuf.LogRecord_Level.TRACE;

  // onLogEvent
  // onMeshHeartbeat

  connection.onRoutingPacket.subscribe((routingPacket) => {
    console.log(routingPacket);
  });

  connection.onTelemetryPacket.subscribe((telemetryPacket) => {
    console.log(telemetryPacket.data.variant);

    device.setMetrics(telemetryPacket);
  });

  connection.onDeviceStatus.subscribe((status) => {
    device.setStatus(status);

    if (status === Types.DeviceStatusEnum.DEVICE_CONFIGURED) {
      // device.setReady(true);
    } else if (status === Types.DeviceStatusEnum.DEVICE_DISCONNECTED) {
      device.setReady(false);
    }
  });

  connection.onMyNodeInfo.subscribe((nodeInfo) => {
    device.setHardware(nodeInfo);
  });

  connection.onUserPacket.subscribe((user) => {
    device.addUser(user);
  });

  connection.onPositionPacket.subscribe((position) => {
    device.addPosition(position);
  });

  connection.onNodeInfoPacket.subscribe((nodeInfo) => {
    device.addNodeInfo(nodeInfo);
  });

  connection.onChannelPacket.subscribe((channel) => {
    device.addChannel({
      config: channel.data,
      lastInterraction: new Date(),
      messages: [],
    });
  });
  connection.onConfigPacket.subscribe((config) => {
    device.setConfig(config.data);
  });
  connection.onModuleConfigPacket.subscribe((moduleConfig) => {
    device.setModuleConfig(moduleConfig.data);
  });

  connection.onMessagePacket.subscribe((messagePacket) => {
    device.addMessage({
      message: messagePacket,
      ack: messagePacket.packet.from !== device.hardware.myNodeNum,
      received: messagePacket.packet.rxTime
        ? new Date(messagePacket.packet.rxTime * 1000)
        : new Date(),
    });
  });
};
