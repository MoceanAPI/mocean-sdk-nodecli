const moceansdk = require("mocean-sdk");
const Config = require("./Config");
const clitable = require("cli-table2");
const colors = require("colors");


class Request{

    
    constructor()
    {
        this.verbose = false;
        try
        {
            this.mocean = new moceansdk.Mocean(token());
        }
        catch(e)
        {
            console.error("Unable to generate token. Please contact CLI provider.");
            process.exit(0);
        }
        
    }

    static getInstance()
    {
        if(typeof Request.instance == "undefined")
        {
            Request.instance = new Request();
        }
        return Request.instance
    }


    sendSMS(from,to,text)
    {
        this.mocean.sms().create({"mocean-from":from,"mocean-to":to,"mocean-text":text,"mocean-resp-format":"JSON"}).send((err,res)=>{

            if(!err)
            {
                res = JSON.parse(res);
                if(this.verbose)
                {
                    if(typeof res.status == "undefined")
                    {
                        var table = new clitable({head:["Recipient".yellow,"Message ID".yellow]})
                        var messages = res.messages;
                        for(var x in messages)
                        {
                            table.push([messages[x]["receiver"],messages[x]["msgid"]]);
                        }
                        console.log(table.toString());
                    }
                    else
                    {
                        console.log(res.err_msg.split("+").join(" "));
                    }
                }
                else
                {
                    console.log(res);
                }
                process.exit(0);
                
            }
            else
            {
                console.log(err);
            }
            process.exit(1);

        });
    }

    getSmsStatus(msgid)
    {
        this.mocean.message_status().inquiry((err,res)=>{

            if(!err)
            {
                res = JSON.parse(res);
                if(this.verbose)
                {
                    if(res.status == 0)
                    {
                        var table = new clitable({head:["Message status".yellow,"Message id".yellow,"Credit deducted".yellow]});
                        table.push([map_message_status_code(res.message_status),res.msgid,res.credit_deducted]);
                        console.log(table.toString());
                    }
                    else
                    {
                        console.log(res.err_msg.split("+").join(" "));
                    }
                }
                else
                {
                    console.log(res);
                }
                
                process.exit(0);
            }
            else
            {
                console.log(err)
            }
            process.exit(1)

        },{"mocean-resp-format":"JSON","mocean-msgid":msgid})
    }
    
    verifyRequest(brand,to)
    {
        this.mocean.verify_request().create({"mocean-brand":brand,"mocean-to":to,"mocean-resp-format":"JSON"}).send((err,res)=>{

            if(!err)
            {
                res = JSON.parse(res);
                if(this.verbose)
                {
                    if(res.status == 0)
                    {
                        if(!this.isVerbose(res))
                        {
                            var table = new clitable({head:["Request ID".table]});
                            table.push([res.reqid])
                            console.log(table.toString());
                        }
                        
                    }
                    else
                    {
                        console.log(res.err_msg.split("+").join(" "));
                    }
                }
                else
                {
                    console.log(res)
                }
                process.exit(0);
            }
            else
            {
                console.log(err);
            }
            process.exit(1);

        });
    }
    
    verifyValidate(reqid,code)
    {
        this.mocean.verify_validate().create({"mocean-reqid":reqid,"mocean-code":code,"mocean-resp-format":"JSON"}).send((err,res)=>{

            if(!err)
            {
                res = JSON.parse(res)
                if(this.verbose)
                {
                    if(res.status == 0)
                    {
                        var table = new clitable({head:["Request ID".yellow,"Message ID".yellow,"Charged".yellow]});
                        table.push([res.reqid,res.msgid,res.price+" "+res.currency]);
                        console.log(table.toString());
                    }
                    else
                    {
                        console.log(res.err_msg.split("+").join(" "));
                    }
                }
                else
                {
                    console.log(res)
                }
                process.exit(0);
            }
            else
            {
                console.log(err);
            }
            process.exit(1);
        });
    }

    getBalance(callback)
    {
        if(!callback)
        {
            callback = (err,res)=>{
               
                if(!err)
                {   res = JSON.parse(res);
                    if(this.verbose)
                    {
                        if(res.status == 0)
                        {
                            if(!this.isVerbose(res))
                            {
                                var table = new clitable({head:["Balance".yellow]})
                                table.push([res.value])
                                console.log(table.toString());
                            }
                        }
                        else
                        {
                            console.log(res.err_msg.split("+").join(" "));
                        }
                        
                    }
                    else
                    {
                        console.log(res)
                    }
                    process.exit(0);
                }
                else
                {
                    console.log(err);
                }
                process.exit(1);
            };
        }
        this.mocean.balance().inquiry(callback,{'mocean-resp-format':'JSON'});
    }


    getPriceList(params = {})
    {
        params["mocean-resp-format"] = "JSON";
        this.mocean.pricing_list().inquiry((err,res)=>{
            res = JSON.parse(res);
            if(!err)
            {   
                if(this.verbose)
                {
                    if(res.status == 0)
                    {   
                        var table = new clitable({head:["Country".yellow,"Operator".yellow,"Price".yellow]});
                        var def = [];
                        var non_def = [];
                        for(var x in res.destinations)
                        {
                            if(res.destinations[x]["country"] == "Default")
                            {
                                def.push(["Other country","Other country",`${res.destinations[x]["price"]} ${res.destinations[x]["currency"]}`]);
                                continue;
                            }
                            table.push([res.destinations[x]["country"],res.destinations[x]["operator"],`${res.destinations[x]["price"]} ${res.destinations[x]["currency"]}`]); 
                        }
                        if(def.length > 0) table.push(def[0]);
                        console.log(table.toString());
                    }
                    else
                    {
                        console.log(res.err_msg.split("+").join(" "));
                    }
                }
                else
                {
                    console.log(res);
                } 
                process.exit(0);
            }
            else
            {
                console.log(err);
            }
            process.exit(1);

        },params);
    }

    isVerbose(res)
    {
        if(!this.verbose)
        {
            console.log(res);
            return true;
        }
        return false;
    }


    enableVerbose()
    {
        this.verbose = true;
    }
}


module.exports = Request;

var client;

let token = () =>{

    if(!client && isCredentialValid())
    {   
        var credential = Config.getCredential().credential;
        client = new moceansdk.Client(credential.api_key,credential.api_secret);
        return client;
    }
    else
    {
        console.error("Please run mocean setup <api_key> <api_secret>");
        process.exit(1);
    }
}



let  isCredentialValid = () =>{
    if(typeof Config.getCredential().credential != 'undefined')
    {
        return true;
    }
    console.error("Please run mocean setup <api_key> <api_user>");
    process.exit(1);
    return false;
}

let callback = (err,res)=>{

    if(err)
    {
        console.log(parseResponse(err));
    }
    else
    {
        console.log(parseResponse(res));
    }

}


var parseResponse = (res) =>
{
    return res;
}

let map_message_status_code = (code)=>{

    var list = {
        1: "Transaction success.",
        2: "Transaction failed.",
        3: "Transaction failed due to message expired.",
        4: "Transaction pending for final status.",
        5: "Transaction not found."
    }
    return list[code];
} 