const miio = require('miio');

export class MiPlug {
	device: any;

	constructor(private ip: string, private token: string) {}

	public async get(): Promise<boolean> {
		if (!this.device) await this.connect();
		const rawPower = await this._get();
		const power = this.decideState(rawPower[0]);
		return power;
	}

	public async set(power: boolean): Promise<string | 'unknown'> {
		if (!this.device) await this.connect();
		const result = await this._set(power);
		if (result[0] !== 'ok') return 'UNKNOWN';
		return power ? 'ON' : 'OFF';
	}

	private decideState(state: string): boolean {
		if (state === 'off') return false;
		else if (state === 'on') return true;
		return false
	}

	private async connect(): Promise<unknown> {
		this.device = await this._connect();
		return this.device;
	}

	private _get() {
		return this.device.miioCall('get_prop', ['power']);
	}

	private _set(power: boolean) {
		const message = power ? 'on' : 'off';
		return this.device.miioCall('set_power', [message]);
	}

	private _connect(): Promise<any> {
		return miio.device({address: this.ip, token: this.token})
	}
}
