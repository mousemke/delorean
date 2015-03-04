Delorean - 

the node backend for McFly.



the t parameter sets the target module. delorean will not work without it.

example:

    http://192.168.178.106:9091/?t=relayr

    http://192.168.178.106:9091/?t=hue&light=12&bri=255&sat=255&hue=1000


**t=nest**
```
    home
        true
        false

    away
        true
        false

    increase
        (amount to increase temp)

    lower
        (amount to lower temp)

    temp
        (temp to set)

    fan
        on
        auto
```


**t=hue**
```
    light
        light number

    on
        true
        false

    off
        true
        false

    alert
        none
        select
        lselect

    hue
        (0-65535)

    sat
        (0-255)

    bri
        (0-255)

    effect
        none
        colorloop

    transitiontime
        (number, in ms)
```


**t=wunderbar**
```
    sensors
        (anything?)
```


**t=tado**
```
(under development)
```


------------------------------------------------------------

**The following are no longer supported and are disabled in the config by default.**


They can be re-enabled and used by changing the boolean flag in the config from false to true.  They will be supported again if the time comes that any of us have access to these devices.



**t=oven**
```
    on
        true
        false

    off
        true       
        false

    lock
        true
        false

    lights
        true
        false

    brighness
        (1-4)
```


**t=dishwasher**
```
    energy_management 
        (1-2)

    locked    
        true
        false

    lights
        on
        off

    rinse_aid 
        (0-6)

    turbidity 
        (0-2)

    brilliance_dry
        on
        off

    hygiene_plus
        on
        off

    eco_as_default
        true
        false

    intensiv_zone
        on
        off
```



