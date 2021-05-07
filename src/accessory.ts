import {
	AccessoryConfig,
	AccessoryPlugin,
	API,
	CharacteristicEventTypes,
	CharacteristicGetCallback,
	CharacteristicSetCallback,
	CharacteristicValue,
	HAP,
	HAPStatus,
	Logging,
	Service
} from "homebridge";
import isIP from 'validator/lib/isIP';
import isMD5 from 'validator/lib/isMD5';
import {MiPlug} from "./mi-plug";

let hap: HAP;

export = (api: API) => {
	hap = api.hap;
	api.registerAccessory("MiSmartPlug", MiSmartPlugAccessory);
};

class MiSmartPlugAccessory implements AccessoryPlugin {
	private readonly name: string;
	private readonly ip: string;
	private readonly token: string;
	private readonly device: MiPlug;
	private readonly validity: boolean;

	private readonly switchService: Service;
	private readonly informationService: Service;

	constructor(private log: Logging, private config: AccessoryConfig, api: API) {
		this.name = config.name;
		this.ip = config.ip;
		this.token = config.token;
		this.device = new MiPlug(this.ip, this.token);
		this.validity = this.validate(this.ip, this.token);

		this.switchService = new hap.Service.Switch(this.name);
		this.switchService.getCharacteristic(hap.Characteristic.On)
			.on(CharacteristicEventTypes.GET, this.handleGet)
			.on(CharacteristicEventTypes.SET, this.handleSet);

		this.informationService = new hap.Service.AccessoryInformation()
			.setCharacteristic(hap.Characteristic.Manufacturer, config.manufacturer || "Xiaomi")
			.setCharacteristic(hap.Characteristic.Model, config.model || "Mi Smart Plug");

		log.info('Initialization finished');
	}

	handleGet = (callback: CharacteristicGetCallback) => {
		if (!this.validity) {
			this.validate(this.ip, this.token);
			callback(HAPStatus.SERVICE_COMMUNICATION_FAILURE, false);
			return;
		}
		this.device.get()
			.then((power) => {
				this.log.info(`Current state ${power ? "ON" : "OFF"}`);
				callback(HAPStatus.SUCCESS, power);
			})
			.catch((e: Error) => {
				callback(HAPStatus.OPERATION_TIMED_OUT, false);
				this.log.error(e.message);
			});
	}

	handleSet = (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
		if (!this.validity) {
			this.validate(this.ip, this.token);
			callback(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
			return;
		}
		this.device.set(value as boolean)
			.then((result) => {
				this.log.info(`Switch state was set to: ${result}`);
				callback(HAPStatus.SUCCESS);
			})
			.catch((e: Error) => {
				callback(HAPStatus.OPERATION_TIMED_OUT);
				this.log.error(e.message);
			});
	}

	validate(ip: string, token: string): boolean {
		const isValidIp = isIP(ip, 4);
		const isValidToken = isMD5(token);
		if (!isValidIp) this.log.error('The given ip address is not valid');
		if (!isValidToken) this.log.error('The given token is not valid');
		return isValidIp && isValidToken;
	}

	getServices(): Service[] {
		return [
			this.informationService,
			this.switchService,
		];
	}

}
