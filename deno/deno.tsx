import { serve } from "https://deno.land/std@0.120.0/http/server.ts";

async function handleRequest(request: Request) {
  const req = request
  const urlStr = req.url
  const urlObj = new URL(urlStr)
  const path = urlObj.href.substr(urlObj.origin.length)
  const headers_init = {
    headers: {
      "content-type": "application/javascript; charset=utf-8",  //默认UTF-8格式
      "Access-Control-Allow-Origin": "*", //如果确定域名,把"*"改成"https://hitokoto.https://hitokoto.deno.dev"
      // "Access-Control-Allow-Methods": "GET" 
    }
  }
  const status_404 = {
    status: 404,
    headers: {
      "content-type": "application/javascript; charset=utf-8",  //默认UTF-8格式
      "Access-Control-Allow-Origin": "*",
    }
  }
  console.log(path)
  try{
    if (path=="/favicon.ico") { //favicon
      return fetch("https://cdn.jsdelivr.net/npm/zg-cdn/logo/64.png")
    }
    // 判断非法请求用户, 很简陋
    const hostdomain = request.headers.get("host");
    const ua = request.headers.get("user-agent");
    if (path=="/" || hostdomain != 'hitokoto.deno.dev' || !ua.match(/Mozilla\/5.0\b/i) ) {
      return Response.redirect('https://github.com/zigou23/hitokoto/tree/main/deno', 301); //重定向
    }
    /**
     * Hitokoto
     * /
     */
    
    if (path.startsWith('/js') || path.startsWith('/text')) {
      const url = urlObj.searchParams.get('url'); //获取?url
      let HitokotoFetchURL="";
      // 判断?url=是否有数值
      if(url){
        HitokotoFetchURL="https://cdn.jsdelivr.net/"+url+".txt"
      }else{ //没有使用默认值
        HitokotoFetchURL="https://cdn.jsdelivr.net/gh/sy-records/hitokoto@master/hitokoto.txt"
      }
      /** 参考
       * https://medium.com/deno-the-complete-reference/fetch-timeout-in-deno-91731bca80a1
       * 请求限制时间
       */
      const c=new AbortController();
      const id=setTimeout(() => c.abort(), 1000);
      const r=await fetch(HitokotoFetchURL, {signal: c.signal});
      clearTimeout(id);
      //以"\n"回车为分界线储值
      const Hitokotos = (await r.text()).split("\n")
      if(Hitokotos.length < 5){
        return new Response(JSON.stringify({'status':404,'msg':'rows less than 5'}), status_404);
      }
      const random = randomNum(0,Hitokotos.length-1) //生成随机数
      let Hitokoto=Hitokotos[random]
      // 获取其它信息每行"|"之后的信息留作from msg1
      let from1 = ''
      let from2 = ''
      if(Hitokoto.split('|')){ //判断那一行是否有"|"有则返回内容
        const msg = Hitokoto.split('|')
        Hitokoto = msg[0] || ''
        from1 = msg[1] || ''
        from2 = msg[2] || ''
      }
      //js时返回的值
      if (path.startsWith('/js')) {
        if(path.startsWith('/json')){
          return new Response(JSON.stringify({
          "Hitokoto":Hitokoto,
          "from":from1 || '',
          "from2":from2 || '',
          "lenth":Hitokoto.length,
          "id":random+1,
          "rows":Hitokotos.length
        }), headers_init)
        }
        return new Response("document.write('"+Hitokoto+"')", headers_init)
      }
      //纯文本返回的值
      if (path.startsWith('/text')) {
        return new Response(Hitokoto, headers_init)
      }
      return new Response(JSON.stringify({
        "Hitokoto":Hitokoto,
        "from":from1 || '',
        "from2":from2 || '',
        "lenth":Hitokoto.length,
        "id":random+1,
        "rows":Hitokotos.length
      }), headers_init)
    }
  }catch(err) {
    console.log(err)
    return new Response(JSON.stringify({'status':500,'msg':'Request timed out'}), {
      status: 500,
      headers: {
        "content-type": "application/javascript; charset=utf-8",  //默认UTF-8格式
        "Access-Control-Allow-Origin": "*",
      }
    })
}
  
}
// 随机数
function randomNum(minNum,maxNum){
  switch(arguments.length){
    case 1:
      return parseInt(Math.random()*minNum+1,10);
    break;
    case 2:
      return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
    break;
      default:
        return 0;
      break;
  }
}
console.log("Listening on http://localhost:8000");
await serve(handleRequest);

function ErrorPage(arg0: string): BodyInit {
throw new Error("Function not implemented.");
}
