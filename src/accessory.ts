import {
	AccessoryConfig,
	AccessoryPlugin,
	API,
	CharacteristicEventTypes,
	CharacteristicGetCallback,
	CharacteristicSetCallback,
	CharacteristicValue,
	HAP,
	Logging,
	Service
} from "homebridge";
import {MiPlug} from "./mi-plug";

let hap: HAP;

export = (api: API) => {
	hap = api.hap;
	api.registerAccessory("MiSmartPlug", MiSmartPlugAccessory);
};

class MiSmartPlugAccessory implements AccessoryPlugin {
	private readonly log: Logging;
	private readonly name: string;
	private readonly ip: string;
	private readonly token: string;
	private readonly device: MiPlug;

	private readonly switchService: Service;
	private readonly informationService: Service;

	constructor(log: Logging, config: AccessoryConfig, api: API) {
		this.log = log;
		this.name = config.name;
		this.ip = config.ip;
		this.token = config.token;
		this.device = new MiPlug(this.ip, this.token);

		this.switchService = new hap.Service.Switch(this.name);
		this.switchService.getCharacteristic(hap.Characteristic.On)
			.on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
				this.device.get().then((power) => {
					log.info(`Current state ${power ? "ON" : "OFF"}`);
					callback(undefined, power);
				})
			})
			.on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
				this.device.set(value as boolean).then((result) => {
					log.info(`Switch state was set to: ${result}`);
					callback();
				});
			});

		this.informationService = new hap.Service.AccessoryInformation()
			.setCharacteristic(hap.Characteristic.Manufacturer, "Custom Manufacturer")
			.setCharacteristic(hap.Characteristic.Model, "Custom Model");
	}

	getServices(): Service[] {
		return [
			this.informationService,
			this.switchService,
		];
	}

}
