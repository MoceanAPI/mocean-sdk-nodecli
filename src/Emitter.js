const EventEmitter = require("events").EventEmitter();

class Emitter{

    constructor()
    {
        this.EventEmitter = new EventEmitter();
    }
    instance()
    {
        if(!this.instance instanceof Emitter)
        {
            this.instance = new Emitter();
        }
        return this.instance;
    }
    customEvent()
    {
        this.on("balance",()=>{
            console.log('request balance');
        })
    }

    emit(e)
    {
        this.EventEmitter.emit()
    }

    
}

module.exports = Emitter;