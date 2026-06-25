---
name: jiaqi-xhs-persona
description: Writes Xiaohongshu posts in one of six predefined persona voices: 专业靠谱型、温柔贴心型、爽快高效型、生活顾问型、理财达人型、热心资源型. Use it when the user wants persona-driven copy, says "用XX人设写一篇小红书", "按专业靠谱的风格写", "帮我写温柔贴心型的文案", or provides a topic and asks which persona fits.
version: 0.1.0
---

# jiaqi-xhs-persona

Generates Xiaohongshu post copy in a specific persona voice. Each persona has distinct language patterns, sentence rhythm, emoji usage, and topic framing rules. Output format is identical to `jiaqi-xhs-text` so it chains directly into `jiaqi-xhs-image`.

## When to trigger

- User says "用XX人设写"、"XX风格的小红书"、"温柔贴心型文案"、"专业靠谱的语气"
- User lists a topic and mentions one of the six personas by name
- User asks "哪种人设适合我" — help them choose based on their described audience

Do not trigger when:

- The user wants a non-persona generic post — use `jiaqi-xhs-text` instead
- The user wants to define a completely custom persona not in the six presets — ask them to describe it and adapt the closest preset

## User Input Tools

Collect missing inputs in a single prompt:

| Input | Description | Default |
|-------|-------------|---------|
| 人设类型 | One of the six presets (see below) | Required |
| 主题 / 关键词 | What the post is about | Required |
| 图片张数 | Number of image sections | 3 |

If the user is unsure which persona to pick, ask one question: "你的粉丝主要是什么类型的人？" and recommend based on their answer.

## EXTEND.md support

Check for EXTEND.md in this order (first found wins):

1. `.jiaqi-skills/jiaqi-xhs-persona/EXTEND.md` (project-level)
2. `~/.jiaqi-skills/jiaqi-xhs-persona/EXTEND.md`

EXTEND.md may override: default persona, banned words, preferred hashtag categories, signature phrase to append to every post.

## Persona specifications

### 1. 专业靠谱型

**核心定位**：懂业务、讲得清、办事稳。让读者觉得"有问题找他比较放心"。

**语言规则**：
- 每段至少有一个具体数字、步骤编号、或对比数据
- 开头用"帮大家梳理一下"、"很多人问我这个问题"、"直接说结论"
- 解释术语时加括号说明，如"久期（也就是持有时间）"
- 结尾给明确建议，不留模糊空间

**禁止**：感叹词堆叠、"超级棒""绝了"等口语化词、超过 2 个连续 emoji

**Emoji 风格**：📊 📋 ✅ 🔍（功能性为主，不超过每段 1 个）

**话题标签方向**：干货分享、行业知识、专业建议 + 具体领域词

---

### 2. 温柔贴心型

**核心定位**：说话耐心，关注读者感受，适合家庭客户、女性用户、中老年群体。

**语言规则**：
- 多用"你不用担心"、"我们一起来看看"、"慢慢来没关系"
- 短句为主，每句不超过 20 字
- 先共情再给信息："很多姐妹都有这个困惑，我完全理解……"
- 结尾用鼓励性收尾，如"相信你一定可以做到"

**禁止**：命令式语气（"你应该"、"必须"）、生硬的数据罗列、否定性开头

**Emoji 风格**：🌸 💕 ☀️ 🤗（温暖柔和，可每段 1-2 个）

**话题标签方向**：生活贴士、暖心分享、女性成长 + 具体场景词

---

### 3. 爽快高效型

**核心定位**：不绕弯子，回复快、执行快，帮读者快速解决问题。

**语言规则**：
- 正文第一句就给答案或行动指令，绝不铺垫
- 用数字列表：1. 2. 3. 或"第一步 / 第二步"
- 句子短，每句不超过 15 字
- 用"直接告诉你"、"3步搞定"、"不废话"、"记住这一条就够了"

**禁止**：超过 10 字的过渡句、感慨式开头、无实质内容的情绪铺垫

**Emoji 风格**：⚡ ✅ 🎯 💡（干练简洁，不超过每段 1 个）

**话题标签方向**：效率技巧、实用攻略、快速解决 + 具体场景词

---

### 4. 生活顾问型

**核心定位**：懂热点、也懂生活，分享生活、出行、热点、社会重大新闻，把专业知识融入日常场景。

**语言规则**：
- 从一个生活场景或热点切入，再引出专业内容
- 用"最近发现"、"这个你一定遇到过"、"说个真实案例"
- 把抽象建议具象化：不说"要注意风险"，说"就像你买手机会看评测一样"
- 结尾给一个生活化的行动建议

**禁止**：脱离生活场景的纯说教、冷冰冰的专业堆砌

**Emoji 风格**：🌟 🏃 🍜 🗺️（生活感，每段 1-2 个，多样化）

**话题标签方向**：生活方式、日常分享、热点话题 + 具体场景词

---

### 5. 理财达人型

**核心定位**：擅长讲市场、讲产品、讲配置，帮读者理解商业逻辑，安排好自己的钱。

**语言规则**：
- 从"底层逻辑"或"市场信号"切入
- 用类比解释复杂概念："利率就像水位，水位低的时候……"
- 结构：现状→原因→影响→建议配置方向
- 区分"观察"（现在发生什么）和"判断"（我认为会怎样），后者要加"个人看法"提示

**禁止**：承诺收益的表述、"一定能赚"、"稳赚不赔"类语言；绕开监管措辞

**Emoji 风格**：📈 💰 🔑 📉（金融感，每段 1 个）

**话题标签方向**：理财知识、投资逻辑、财经分析 + 具体产品/市场词

---

### 6. 热心资源型

**核心定位**：人脉广、资源多，帮读者对接人脉和实用资源，有"认识我就是你的资产"的感觉。

**语言规则**：
- 以"我帮大家对接一下"、"这个资源很多人不知道"、"认识一个做XX的朋友"开头
- 具体说资源的价值，不要泛泛而谈
- 给明确的获取路径："有需要的评论区告诉我"、"私信关键词XX"
- 结尾强调稀缺性或时效性，制造行动动机

**禁止**：夸大虚假资源承诺、无法兑现的"内部福利"

**Emoji 风格**：🤝 🎁 📩 🔗（社交连接感，每段 1-2 个）

**话题标签方向**：资源共享、人脉对接、福利干货 + 具体资源类型词

---

## Output format

Use the exact same structure as `jiaqi-xhs-text` so `jiaqi-xhs-image` can pick it up directly:

```
【标题】
<title with 1-2 emojis matching persona style, ≤20 Chinese characters>

【正文】
<section 1 — hook, in persona voice>

<section 2 — substance, in persona voice>

<section 3 — CTA or closing, in persona voice>
...

【话题标签】
#tag1 #tag2 #tag3 ...

【海报风格建议】
图1：<one-line style note matching persona mood>
图2：<one-line style note>
图3：<one-line style note>
```

Do not add any commentary before or after this block.

## Writing rules that apply to all personas

- Title must use one of the four hook types: 问句 / 反差 / 数字 / 悬念 — adapted to persona voice
- Body: N sections = image count. First = hook, last = CTA
- Each section: 80–150 Chinese characters
- Hashtags: 5–8 tags, mix broad traffic tags + niche tags
- 海报风格建议: one-line style note per image (mood/color tone, not scene description)
- Emoji usage follows persona spec above — do not mix styles across personas

## Process

1. **Collect inputs** — ask for persona type, topic, and image count in one combined prompt if anything is missing.
2. **Check EXTEND.md** — apply any overrides (default persona, banned words, signature phrase).
3. **Select persona rules** — load the matching persona spec above.
4. **Write** — apply persona language rules to every sentence. Do a quick check: does each sentence sound like this persona? Would this persona use this word?
5. **Output** in the exact format above.
6. **Offer next step** — remind the user they can say "帮我把这个出成海报图" to feed the output into `jiaqi-xhs-image`.
