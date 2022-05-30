const { segment } = require(`oicq`);
const request = require(`sync-request`);
const logger = new NIL.Logger(`test`);
const path = require(`path`);

const config = JSON.parse(NIL.IO.readFrom(path.join(__dirname, `config.json`)));
let pic_cmd = config.pic_cmd;
let force_wl = config.force_wl;
let no_wl_reply = config.no_wl_reply;
let appkey = config.appkey

const max_result = 2000
// const api = `https://way.jd.com/showapi/tpxh?time=2015-07-10&page=1&maxResult=1&appkey=ba3c20292d951e1a41b1a6f35e316756`
// let pic_url = `https://wx2.sinaimg.cn/large/67c56aa4gy1h1tf7d18kkj20n50v2afl.jpg`;
// let pic = segment.image(pic_url);
// pic.asface = true;

function getRandomNumber(type, range){
    if (type == 0){
        let random_number = Math.floor(Math.random()*range);
        return random_number
    }else if (type == 1){
        let random_number = Math.ceil(Math.random()*range);
        return random_number
    }
}

function GET_Request(){// 获取url
    const api = `https://way.jd.com/showapi/tpxh?time=2015-07-10&page=`  + getRandomNumber(1, 10)+ `&maxResult=` + max_result + `&appkey=` + appkey;
    let obj = request(`GET`, api);
        if(obj.statusCode == 200){
            let data = JSON.parse(obj.getBody(`utf8`));
            let contentlist = `${data.result.showapi_res_body.contentlist.img}`;
            let pic_url = `${data.result.showapi_res_body.contentlist[getRandomNumber(0, contentlist.length)].img}`;
            if(pic_url == null){
                let err = `查寻失败！`;
                return err
            }else if(pic_url == undefined){
                let err = `查寻失败！`;
                return err
            }else{
                return pic_url
            }
        }
}

function check_wl(qq){
    let if_wl = NIL._vanilla.wl_exists(qq);
    return if_wl
}

class MagicJokes extends NIL.ModuleBase{
    onStart(api){
        logger.setTitle(`MaigcJokes`);
        logger.info(`MaigcJokes loaded!`);
        api.listen(`onMainMessageReceived`, (e) => {
            if (e.raw_message == pic_cmd){
                let a = GET_Request();
                let pic = segment.image(a);
                pic.asface = config.asface;
                if (check_wl(e.sender.qq) == true){
                    e.reply(pic);
                }else{
                    if (force_wl == false){
                        e.reply(pic);
                    }else{
                        e.reply(no_wl_reply);
                    }
                }
            }
            })
        }
    }

module.exports = new MagicJokes;