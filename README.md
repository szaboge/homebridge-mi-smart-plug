# Homebridge Mi Smart Plug

[Homebridge](https://homebridge.io) Plugin for Xiaomi Mi Smart Plug
<p align="center">
<img src="https://github.com/szaboge/homebridge-mi-smart-plug/blob/main/assets/plug.png?raw=true" width="150">
</p>

## Supported devices
- chuangmi.plug.hmi206

If working with your device too, please open an issue to add this list.
## Installation

Before installing this plugin, you should install Homebridge using the [official instructions](https://github.com/homebridge/homebridge/wiki).

### Manual Installation

1. Install this plugin using: 
   ```
   npm install -g homebridge-mi-smart-plug --unsafe-perm
   ```
2. Edit `config.json` manually to add your plug. See below for instructions on that.

## Configuration

```
"accessories": [
    {
        "accessory": "MiSmartPlug",
        "name": "Mi Smart Plug",
        "ip": "X.X.X.X",
        "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    }
]
```

### Fields:
* **accessory**: Must always be "MiSmartPlug" (required)
* **name**: Name that will be displayed in your home app (required)
* **ip**: IP address of the smart plug (required)
* **token**: The device token of the smart plug (required)

## IP address

1. Install the miio npm package
    ```
    npm install -g miio
    ```
2. Make sure your computer is on the same network with your smart plug, then run following command.

   ```
   miio discover
   ```

3. You may need to wait few seconds until you get the response similar to below:

   ```
   Device ID: 127261362
   Model info: Unknown
   Address: X.X.X.X
   Token: ???
   Support: Unknown
   ```
4. This *Address* will be your device IP address in configuration

## Token
This is no so straight forward but it shouldn't be to hard either. I don't plan to keep and updated tutorial on this but there a lot of good ones online so you can use google to find them.

A very comprehensive one can be found [here](https://github.com/Maxmudjon/com.xiaomi-miio/blob/master/docs/obtain_token.md)
