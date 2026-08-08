# Doubao Seedream 5.0 pro教程

火山方舟

![](images/b4483f822ab693bab69844a57304d470ff21f978e4766b0ec3b38af0c24ce431.jpg)

## 法律声明

本《火山方舟》的所有内容，包括但不限于文字、商标、架构、图示、图片、页面布局等, 其知识产权（著作权、商标权、专利权、商业秘密等）归属于北京火山引擎科技有限公司及其关联公司（火山引擎），非经火山引擎书面同意，任何个人和组织不得复制、使用、修改、转发或以任何违反本《火山方舟》所承载的目的进行传播。

本《火山方舟》陈述内容仅作为产品的通用性介绍和参考性指引，火山引擎保留按“现状”和“当前可用”的形式提供产品和服务的权利。火山引擎不对本《火山方舟》中所载的产品功能、性质、质量、标准等内容进行明示或默示的保证和承诺，最终以您与火山引擎实际签署的协议为准。

如您发现本《火山方舟》有任何错误或歧义，或发现有对本《火山方舟》、产品本身的侵权行为，请与火山引擎取得联系。

联系方式：service@volcengine.com，400-850-0030（周一至周五 10:00-18:00）

## 目录

目录---  
1. Doubao Seedream 5.0 pro 教程

## 1. Doubao Seedream 5.0 pro 教程

Doubao Seedream 5.0 pro（以下简称 Seedream 5.0 pro）面向高精度图片生成场景，提供更精准的位置与元素控制能力。支持文生图、单张图生图、多参考图生图（最多 10 张），以及通过交互编辑实现精准坐标定位和任意标记编辑。本文重点介绍 Seedream 5.0 pro 的专属能力，帮助您快速实现 Image generationAPI 调用。

## 特色能力

Seedream 5.0 pro 新增以下特色功能：

## 交互编辑

![](images/00c5589f6418688ee5387e40db1d8ba13b579c281d385288f9bf7bca07b134ac.jpg)

## 原生多语种生成

支持通过坐标、框选、箭头等多种方式指定编辑位置，精准编辑图片，实现局部元素替换、物品定位、区域生成等精细化操作。

![](images/507a3157218278af592e099a599d19d437860dbef81af5ba1692b6a97a153db8.jpg)

<details>
<summary>seal</summary>

你好
</details>

新增支持俄语、阿拉伯语、菲律宾语、泰语、土耳其语、韩语、马来语、西班牙语、葡萄牙语、印尼语、法语、德语、越南语、日语等 14 种语言的原生文字生成能力。

## 能力概述

以下为 Seedream 系列各版本模型的能力与参数对比，帮助您根据业务需求选择合适的模型。

![](images/dc5302d74a21a80c5de19e1b7ab56ff70c7ce592d3b9d34fab3e17fca16912e2.jpg)

<table><tr><td rowspan=1 colspan=2>模型名称</td><td rowspan=1 colspan=1>Seedream 5.0pro</td><td rowspan=1 colspan=1>Seedream 5.0lite</td><td rowspan=1 colspan=1>Seedream 4.5</td><td rowspan=1 colspan=1>Seedream 4.0</td></tr><tr><td rowspan=1 colspan=2></td><td rowspan=1 colspan=1>doubao-seedream-5-0-pro-260628</td><td rowspan=1 colspan=1>doubao-seedream-5-0-260128 (同时支持：doubao-seedream-5-0-lite-260128)</td><td rowspan=1 colspan=1>doubao-seedream-4-5-251128</td><td rowspan=1 colspan=1>doubao-seedream-4-0-250828</td></tr><tr><td rowspan=1 colspan=2>文生图</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>√</td></tr><tr><td rowspan=1 colspan=2>文生组图</td><td rowspan=1 colspan=1>暂不支持</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>√</td></tr><tr><td rowspan=1 colspan=2>单/多图生图</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>√</td></tr><tr><td rowspan=1 colspan=2>单/多图生组图</td><td rowspan=1 colspan=1>暂不支持</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>√</td></tr><tr><td rowspan=1 colspan=2>交互编辑</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>X</td><td rowspan=1 colspan=1>X</td><td rowspan=1 colspan=1>X</td></tr><tr><td rowspan=1 colspan=2>流式输出</td><td rowspan=1 colspan=1>暂不支持</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>√</td></tr><tr><td rowspan=1 colspan=2>联网搜索</td><td rowspan=1 colspan=1>暂不支持</td><td rowspan=1 colspan=1>√</td><td rowspan=1 colspan=1>X</td><td rowspan=1 colspan=1>X</td></tr><tr><td rowspan=4 colspan=1>模型参数</td><td rowspan=1 colspan=1>分辨率</td><td rowspan=1 colspan=1>1K, 1.5K, 2K</td><td rowspan=1 colspan=1>2K, 3K, 4K</td><td rowspan=1 colspan=1>2K, 4K</td><td rowspan=1 colspan=1>1K, 2K, 4K</td></tr><tr><td rowspan=1 colspan=1>输出格式</td><td rowspan=1 colspan=1>png, jpeg</td><td rowspan=1 colspan=1>png, jpeg</td><td rowspan=1 colspan=1>jpeg</td><td rowspan=1 colspan=1>jpeg</td></tr><tr><td rowspan=1 colspan=1>提示词优化模式</td><td rowspan=1 colspan=1>标准模式,极速模式</td><td rowspan=1 colspan=1>标准模式</td><td rowspan=1 colspan=1>标准模式</td><td rowspan=1 colspan=1>标准模式,极速模式</td></tr><tr><td rowspan=1 colspan=1>生成数量</td><td rowspan=1 colspan=1>支持生成单图/多张图层</td><td rowspan=1 colspan=1>输入的参考图数量+最终生成的图片数量≤15张</td><td rowspan=1 colspan=1></td><td rowspan=1 colspan=1></td></tr><tr><td rowspan=1 colspan=2>限流IPM（张/分钟）</td><td rowspan=1 colspan=1>500</td><td rowspan=1 colspan=1>500</td><td rowspan=1 colspan=1>500</td><td rowspan=1 colspan=1>500</td></tr></table>

## 基础使用

Seedream 5.0 pro 的基础使用方式（文生图、图文生图、多图融合）与其他 Seedream 模型一致，只需将model 参数替换为 doubao-seedream-5-0-pro-260628 。详细代码示例和说明请参考：

文生图•

图文生图•

多图融合•

## 交互编辑

Seedream 5.0 pro 支持通过 框选、点位、箭头、标注框、坐标 等方式指定编辑位置，实现对局部区域的精准生成或修改。详细操作说明请参考 Seedream 5.0 pro 交互编辑指南 。

## 使用示例-任意标记

在参考图上通过手绘草图、涂鸦、圈选等任意标记指定编辑区域，模型将识别标记范围并在其中生成或替换内容，同时自然融入原有场景。

## 提示词

根据手绘草图对图像进行编辑。在左下角标记区域添加一叠真实的杂志或艺术画册，并在右侧标记区域添加一个带杯碟的陶瓷杯咖啡。移除所有草图线条。保持构图不变。让新添加的物体自然融入原有场景中。

输入图  
![](images/4e8dd2af244e2d2212a17072a7e178c3801c4ccac5caaea4a737e2f952379775.jpg)

输出  
![](images/a95307eb58050b9c38432ffb28463189fc417b096443078351222de30e4abee6.jpg)

## Curl

Bash   
curl https://ark.cn-beijing.volces.com/api/v3/images/generations \   
-H "Content-Type: application/json" \   
-H "Authorization: Bearer \$ARK\_API\_KEY" \   
-d '{   
"model": "doubao-seedream-5-0-pro-260628",   
"prompt": "根据手绘草图对图像进行编辑。在左下角标记区域添加一叠真实的杂志或艺术画册，   
并在右侧标记区域添加一个带杯碟的陶瓷杯咖啡。移除所有草图线条。保持构图不变。让新添加   
的物体自然融入原有场景中。",   
"image": "https://ark-project.tos-cn-beijing.volces.com/doc\_image/seedream\_50\_pro\_input2.png",   
"size": "2K",   
"output\_format":"png",   
"watermark": false   
}'

您可按需替换 Model ID。Model ID 查询见 模型列表 。•

## Python

```python
import os
# Install SDK: pip install 'volcengine-python-sdk[ark]'
from volcenginesdkarkruntime import Ark
client = Ark(
# The base URL for model invocation
```

```python
base_url="https://ark.cn-beijing.volces.com/api/v3", <sub>Python</sub>
# Get API Key: https://console.volcengine.com/ark/region:cn-beijing/apikey
api_key=os.getenv('ARK_API_KEY'),
)
imagesResponse = client.images.generate(
# Replace with Model ID
model="doubao-seedream-5-0-pro-260628",
prompt="根据手绘草图对图像进行编辑。在左下角标记区域添加一叠真实的杂志或艺术画册，
并在右侧标记区域添加一个带杯碟的陶瓷杯咖啡。移除所有草图线条。保持构图不变。让新添加
的物体自然融入原有场景中。",
image="https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream_50_pro_input2.png",
size="2K",
output_format="png",
response_format="url",
watermark=False
)
print(imagesResponse.data[0].url)
```

## Java

```java
package com.ark.sample;
import com.volcengine.ark.runtime.model.images.generation.*;
import com.volcengine.ark.runtime.service.ArkService;
import okhttp3.ConnectionPool;
import okhttp3.Dispatcher;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
public class ImageGenerationsExample {
public static void main(String[] args) {
String apiKey = System.getenv("ARK_API_KEY");
ConnectionPool connectionPool = new ConnectionPool(5, 1, TimeUnit.SECONDS);
Dispatcher dispatcher = new Dispatcher();
ArkService service = ArkService.builder()
.baseUrl("https://ark.cn-beijing.volces.com/api/v3") // The base URL for model invocation
.dispatcher(dispatcher)
.connectionPool(connectionPool)
.apiKey(apiKey)
```

```java
Java .build();
GenerateImagesRequest generateRequest = GenerateImagesRequest.builder()
.model("doubao-seedream-5-0-pro-260628") // Replace with Model ID
.prompt("根据手绘草图对图像进行编辑。在左下角标记区域添加一叠真实的杂志或艺术画
册，并在右侧标记区域添加一个带杯碟的陶瓷杯咖啡。移除所有草图线条。保持构图不变。让新
添加的物体自然融入原有场景中。")
.image("https://ark-project.tos-cn-beijing.volces.com/doc_image/
seedream_50_pro_input2.png")
.size("2K")
.outputFormat("png")
.responseFormat(ResponseFormat.Url)
.watermark(false)
.build();
ImagesResponse imagesResponse = service.generateImages(generateRequest);
System.out.println(imagesResponse.getData().get(0).getUrl());
service.shutdownExecutor();
}
}
```

```go
package main
import (
"context"
"fmt"
"os"
"github.com/volcengine/volcengine-go-sdk/service/arkruntime"
"github.com/volcengine/volcengine-go-sdk/service/arkruntime/model"
"github.com/volcengine/volcengine-go-sdk/volcengine"
)
func main() {
client := arkruntime.NewClientWithApiKey(
os.Getenv("ARK_API_KEY"),
// The base URL for model invocation
arkruntime.WithBaseUrl("https://ark.cn-beijing.volces.com/api/v3"),
)
ctx := context.Background()
outputFormat := model.OutputFormatPNG
```

```go
Go
generateReq := model.GenerateImagesRequest{
Model: "doubao-seedream-5-0-pro-260628",
prompt: "根据手绘草图对图像进行编辑。在左下角标记区域添加一叠真实的杂志或艺术画
册，并在右侧标记区域添加一个带杯碟的陶瓷杯咖啡。移除所有草图线条。保持构图不变。让新
添加的物体自然融入原有场景中。",
Image: volcengine.String("https://ark-project.tos-cn-beijing.volces.com/doc_image/
seedream_50_pro_input2.png"),
Size: volcengine.String("2K"),
OutputFormat: &outputFormat,
ResponseFormat: volcengine.String("url"),
Watermark: volcengine.Bool(false),
}
imagesResponse, err := client.GenerateImages(ctx, generateReq)
if err != nil {
fmt.Printf("generate images error: %v\n", err)
return
}
fmt.Printf("%s\n", *imagesResponse.Data[0].Url)
}
```

## OpenAI

```python
import os
from openai import OpenAI
client = OpenAI(
# The base URL for model invocation
base_url="https://ark.cn-beijing.volces.com/api/v3",
# Get API Key: https://console.volcengine.com/ark/region:cn-beijing/apikey
api_key=os.getenv('ARK_API_KEY'),
)
imagesResponse = client.images.generate(
model="doubao-seedream-5-0-pro-260628",
prompt="根据手绘草图对图像进行编辑。在左下角标记区域添加一叠真实的杂志或艺术画册，
并在右侧标记区域添加一个带杯碟的陶瓷杯咖啡。移除所有草图线条。保持构图不变。让新添加
的物体自然融入原有场景中。",
size="2K",
output_format="png",
response_format="url",
extra_body = {
```

"image": "https://ark-project.tos-cn-beijing.volces.com/doc\_image/<sub>Python</sub>   
seedream\_50\_pro\_input2.png",   
"watermark": False   
}   
)   
print(imagesResponse.data[0].url)

## 使用示例-坐标定位

通过在 prompt 中加入 <point> 或 <bbox> 坐标标签，精确指定跨图的编辑区域，实现主体元素的定位放置。完整调用步骤和参数说明请参考 Seedream 5.0 pro 交互编辑指南 。

![](images/88865d8f82e2c7c7924ddedcd1ad7da90ee0e68cbd91be21ac5a1664876e03fb.jpg)

## 使用说明

交互编辑需要准备以下输入要素： 待编辑图片 和 prompt （包含定位信息 + 编辑指令）。根据定位方式不同，分为以下两种形式：

<table><tr><td>形式1：任意标记+自然语言定位</td><td>形式2：坐标精准定位</td></tr><tr><td>在待编辑图片上通过手绘草图、涂鸦、圈选等方 式标记编辑区域，然后在prompt 中用自然语言 描述标记位置和编辑意图。</td><td>使用工具框定待编辑内容的坐标（坐标获取方式 详见 Seedream 5.0 pro 交互编辑指南），在 prompt 中通过 &lt;point&gt; 或&lt;bbox&gt; 坐标标签 精确指定位置。</td></tr><tr><td>JSON r &quot;prompt&quot;: &quot;在蓝色框内添加一个电视机&quot;</td><td></td></tr><tr><td>}</td><td></td></tr></table>

形式 2：坐标精准定位  
```json
JSON
{
"prompt": "将图1<bbox>179 283 796
986</bbox>的主体放到图2<bbox>118
331 933 871</bbox>位置"
}
```

准备好输入要素后，将 待编辑图片 和 prompt 一起传入 API 接口即可生成图片编辑结果。

## 提示词优化模式

Seedream 5.0 pro 支持通过 optimize\_prompt\_options.mode 参数控制提示词优化的模式：

standard （默认值）：标准模式，生成图片的质量较 fast 模式更优，但耗时更长。

fast ：快速模式，生成图片的耗时较 standard 模式更短。

建议

如您的业务对生成时延较为敏感，推荐使用 fast 模式以节省等待时间。

JSON   
{   
"optimize\_prompt\_options": {   
"mode": "fast"   
}   
}

## 自定义图片输出规格

您可配置以下参数来控制图片输出规格：

size ：指定输出图像的尺寸大小。•

response\_format ：指定生成图像的返回格式。•

output\_format ：指定生成图像的文件格式。•

watermark ：指定是否为输出图片添加水印。•

## 图像输出尺寸

支持以下尺寸设置方式，不可混用。

方式 1：指定分辨率档位（推荐）

在 prompt 中用自然语言描述图片宽高比、图片形状或图片用途，最终由模型判断生成图片的大小。

默认值： 2K•

可选值：• 1K 、 1.5K 、 2K

说明

1.5K 与 1K 价格相同，且图片生成效果更优。

使用方式 1 并在 prompt 中描述特定宽高比时，模型实际映射的宽高像素参考值如下表所示（模型支持生成的宽高比不限于以下列举的标准值，此处仅以常见宽高比为例）。

<table><tr><td colspan="7" rowspan="1">分辨率</td><td colspan="1" rowspan="1">宽高比</td><td colspan="1" rowspan="1">宽高像素值</td></tr><tr><td colspan="7" rowspan="2"></td><td colspan="1" rowspan="1">1:1</td><td colspan="1" rowspan="1">1024x1024</td></tr><tr><td colspan="7" rowspan="2"></td><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1"></td></tr><tr><td colspan="1" rowspan="1">3:4</td><td colspan="1" rowspan="1">864x1152</td></tr><tr><td colspan="7" rowspan="3">1K</td><td colspan="1" rowspan="1">16:9</td><td colspan="1" rowspan="1">1424x800</td></tr><tr><td colspan="1" rowspan="1">9:16</td><td colspan="1" rowspan="1">800x1424</td></tr><tr><td colspan="1" rowspan="1">3:2</td><td colspan="1" rowspan="1">1248x832</td></tr><tr><td colspan="7" rowspan="2"></td><td colspan="1" rowspan="1">2:3</td><td colspan="1" rowspan="1">832x1248</td></tr><tr><td colspan="1" rowspan="1">21:9</td><td colspan="1" rowspan="1">1568x672</td></tr><tr><td colspan="7" rowspan="3"></td><td colspan="1" rowspan="1">1:1</td><td colspan="1" rowspan="1">1536x1536</td></tr><tr><td colspan="3" rowspan="2"></td><td colspan="1" rowspan="2">4:3</td><td colspan="1" rowspan="2">1792x1344</td></tr><tr><td colspan="3" rowspan="1"></td></tr><tr><td colspan="7" rowspan="1"></td><td colspan="1" rowspan="1">3:4</td><td colspan="1" rowspan="1">1344x1792</td></tr><tr><td colspan="7" rowspan="3">1.5K</td><td colspan="1" rowspan="1">16:9</td><td colspan="1" rowspan="1">2048x1152</td></tr><tr><td colspan="1" rowspan="1">9:16</td><td colspan="1" rowspan="1">1152x2048</td></tr><tr><td colspan="1" rowspan="1">3:2</td><td colspan="1" rowspan="1">1872x1248</td></tr><tr><td colspan="7" rowspan="1"></td><td colspan="1" rowspan="1">2:3</td><td colspan="1" rowspan="1">1248x1872</td></tr><tr><td colspan="7" rowspan="1"></td><td colspan="1" rowspan="1">21:9</td><td colspan="1" rowspan="1">2352x1008</td></tr><tr><td colspan="7" rowspan="1">2K</td><td colspan="1" rowspan="1">1:1</td><td colspan="1" rowspan="1">2048x2048</td></tr><tr><td colspan="7" rowspan="3"></td><td colspan="1" rowspan="1">4:3</td><td colspan="1" rowspan="1">2368x1776</td></tr><tr><td colspan="1" rowspan="1">3:4</td><td colspan="1" rowspan="1">1776x2368</td></tr><tr><td colspan="1" rowspan="1">16:9</td><td colspan="1" rowspan="1">2816x1584</td></tr><tr><td colspan="2" rowspan="4"></td><td colspan="1" rowspan="1">9:16</td><td colspan="13" rowspan="1">1584x2816</td></tr><tr><td colspan="1" rowspan="1"></td><td colspan="1" rowspan="1">3:2</td><td colspan="12" rowspan="1">2496x1664</td></tr><tr><td colspan="1" rowspan="1">2:3</td><td colspan="13" rowspan="1">1664x2496</td></tr><tr><td colspan="1" rowspan="1">21:9</td><td colspan="13" rowspan="1">3136x1344</td></tr></table>

## 方式 2：指定宽高像素值（ 宽x高 ）

总像素取值范围：[ 1280x720• （921600）, 2048x2048x1.1025 （4624220）]

宽高比取值范围：[1/16, 16]•

## 说明

采用方式 2 时，需同时满足总像素取值范围和宽高比取值范围。其中，总像素是对单张图宽度和高度的像素乘积限制，而不是对宽度或高度的单独值进行限制。

有效示例 ： 2048x1024•

总像素值 2048x1024=2097152，符合 [921600, 4624220] 的区间要求；宽高比 2048/1024=2，符合 [1/16, 16] 的区间要求，故该示例值有效。

无效示例 ： 512x512•

总像素值 512x512=262144，未达到 921600 的最低要求，故该示例值无效。

<table><tr><td>方式1</td><td>方式2</td></tr><tr><td></td><td></td></tr><tr><td>JSON {</td><td>JSON {</td></tr><tr><td>&quot;prompt&quot;: &quot;生成一组共4张连贯插画， 宽高比为3:2，核心为同一庭院一角的四 季变迁，以统一风格展现四季独特色彩、</td><td>&quot;prompt&quot;: &quot;生成一组共4张连贯插画， 核心为同一庭院一角的四季变迁，以统一</td></tr><tr><td>元素与氛围&quot;，</td><td>风格展现四季独特色彩、元素与氛围&quot; &quot;size&quot;: &quot;2048x2048&quot;</td></tr><tr><td>&quot;size&quot;: &quot;2K&quot;</td><td></td></tr><tr><td>1</td><td>i</td></tr><tr><td></td><td></td></tr></table>

## 图像输出方式

通过设置 response\_format 参数，可以指定生成图像的返回方式：

url ：返回图片下载链接。

b64\_json ：以 Base64 编码字符串的 JSON 格式返回图像数据。

JSON   
{   
"response\_format": "url"   
}

## 图像文件格式

通过设置 output\_format 参数，指定生成图像文件的格式：

png   
jpeg

JSON   
{   
"output\_format": "png"   
}

## 图像中添加水印

通过设置 watermark 参数，来控制是否在生成的图片中添加水印。

false ：不添加水印。

true ：在图片右下角添加"AI生成"字样的水印标识。

JSON   
{   
"watermark": true   
}

## 使用限制

## SDK 版本升级

为保证模型功能的正常使用，请务必升级至最新 SDK 版本。相关步骤可参考 安装及升级 SDK 。图片传入限制

图片格式：jpeg、png、webp、bmp、tiff、gif、heic、heif•

图片传入方式：•

图片 URL：请确保图片 URL 可被访问。◦   
示例： https://ark-project.tos-cn-beijing.volces.com/doc\_image/seedream4\_5\_imageToimage.png

Base64 编码：请遵循格式 data:image/<图片格式>;base64,<Base64编码> 。注意： <图片格式> 必须采用◦小写字母，例如 data:image/png;base64,<base64\_image> 。如需获得图片的 Base64 编码，可使用第三方工具，例如 https://base64.guru/converter/encode/  
image。

宽高比（宽/高）范围：[1/16, 16]•

宽高长度（px） > 14•

大小：不超过 30 MB•

总像素：不超过 6000x6000=36000000 px （对单张图宽度和高度的像素乘积限制，而不是对宽度或高•度的单独值进行限制）

最多支持传入 10 张参考图•

## 保存时间

图片URL仅保留24小时，超时后会被自动清除。请您务必及时保存生成的图片。

## 限流说明

RPM 限流：账号下同模型（区分模型版本）每分钟生成图片数量上限。若超过该限制，生成图片时会•报错。

不同模型的限制值不同，详见 图片生成能力 。•