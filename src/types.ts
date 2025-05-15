export interface WifiController {
       isWifiActive: boolean;
       currentConnection: { name: string; signalStrength: string; isSecured: boolean } | null;
       init(): void;
       connectToNetwork(connectionName: string): Promise<any>;
       renderConnections(): void;
     }