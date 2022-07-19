# Hitokoto deno

## 使用方法

https://hitokoto.deno.dev

| 参数   | 参数用途          |
| ------ | ----------------- |
| /js    | 打印参数          |
| /json  | 返回json参数      |
| /text  | 返回文本          |
| ?`url` | 获取url返回值[^1] |

### url请求内容格式

> 没有`url`值时 默认请求参数 https://cdn.jsdelivr.net/gh/sy-records/hitokoto@master/hitokoto.txt

一行一个一言，如果有from[^2]来源，请在一言后面加上`|`分隔线

> 参考示例
> ```
> 所谓成长，就是拥有无论做什么，做不做得成，都不害怕的底气|from1|from2
> 只要往着想要的生活前进，即使摔倒了，也能安慰自己起飞的过程|from1
> 不要跟朋友合伙做生意,跟朋友做生意有风险|from1|from2
> 能量的意义不在于正负，而在于让你前行|from1
> ```




[^1]: url 格式为`"https://cdn.jsdelivr.net/"+url+".txt"`中间的值，其他域名暂时未开放（防止滥用请求） 例如：https://hitokoto.deno.dev/json?url=gh/zigou23/hitokoto/my 
[^2]: https://hitokoto.deno.dev/json?url=gh/zigou23/hitokoto/test
