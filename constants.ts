
import { AttributeGrade, AttributeRoll } from './types';

// 种族设定
export interface RaceOption {
  name: string;
  title: string;
  description: string;
}

export const RACES: RaceOption[] = [
  {
    name: '人族',
    title: '天地灵长',
    description: '体质孱弱但悟性极高，乃是万物之灵，虽无先天血脉神通，却拥有无限的成长可能，这也是最适合炼丹与阵法的种族。'
  },
  {
    name: '妖族',
    title: '洪荒血脉',
    description: '肉身强横，信奉弱肉强食，修行前期进展缓慢，但觉醒本命神通后同阶无敌，化为人形前易被正道修士猎杀。'
  },
  {
    name: '魔族',
    title: '深渊魔裔',
    description: '生性偏激，以吞噬掠夺为修行捷径，进境神速但极易走火入魔，天生被天地灵气排斥，却能驾驭浊气与魔煞。'
  },
  {
    name: '古灵族',
    title: '元素宠儿',
    description: '乃是天地精气孕育而生的特殊生命（如石灵、火灵），天生免疫大部分法术伤害，寿元悠长，但极难开启灵智与繁衍。'
  },
  {
    name: '修罗族',
    title: '浴血战神',
    description: '生于幽冥血海，男丑女美，天生自带杀气。以战养战，受伤越重爆发力越强，是不知恐惧为何物的战斗机器。'
  },
  {
    name: '龙裔',
    title: '真龙遗孑',
    description: '体内流淌着稀薄的上古龙血，天生肉体与法术双修，威压可震慑万兽，但也因此常被贪婪的修士觊觎，欲抽筋扒皮炼宝。'
  },
  {
    name: '鬼族',
    title: '黄泉幽魂',
    description: '抛弃肉身，专修神魂，物理攻击对其无效，擅长幻术与附身，但极其惧怕雷霆与至阳之火，白日难以出行。'
  },
  {
    name: '天人族',
    title: '谪仙后裔',
    description: '自诩为上界遗民，出生便拥有筑基期修为，容貌绝美，气运加身，却因血脉高贵而往往心高气傲，轻视凡俗功法。'
  }
];

// 疆域设定
export interface RegionOption {
  name: string;
  title: string;
  description: string;
}

export const REGIONS: RegionOption[] = [
  {
    name: '中州神土',
    title: '万道争锋',
    description: '灵气最浓郁的中心大陆，古老世家与不朽皇朝林立，天才如过江之鲫，虽然机缘无数，但阶级固化极重，寒门难出贵子。'
  },
  {
    name: '北冥寒域',
    title: '永夜冰原',
    description: '终年飘雪，万物寂灭，极度适合修炼冰系与暗系功法。此地民风彪悍，生存是唯一法则，传说深海之下藏着鲲鹏祖地。'
  },
  {
    name: '西漠沙海',
    title: '绝灵死地',
    description: '漫天黄沙，水源枯竭，也是异火与苦行僧的聚集地。这里灵气狂暴难驯，不仅磨练心智，更是寻找上古遗迹与佛门传承的宝地。'
  },
  {
    name: '南疆大山',
    title: '巫蛊迷障',
    description: '十万大山连绵不绝，瘴气横行，毒虫遍地。这里宗门观念淡薄，部落林立，擅长御兽、炼蛊与诅咒之术，外乡人踏入九死一生。'
  },
  {
    name: '东海群岛',
    title: '散修乐土',
    description: '岛屿星罗棋布，无尽汪洋中藏着无数海兽妖丹。这里没有森严的宗门法度，贸易繁荣，是散修杀人夺宝、闷声发大财的最佳去处。'
  },
  {
    name: '乱星虚空',
    title: '空间裂隙',
    description: '位于位面边缘的破碎地带，空间乱流肆虐。虽然极度危险，但常有天外陨铁与异界宝物坠落，是亡命之徒与空间系修士的乐园。'
  },
  {
    name: '古战场遗址',
    title: '灵脉尽断',
    description: '上古大战中撕裂的小空间，灵脉尽断，几乎无法感应灵气。选择此地开局将面临地狱难度，但也可能在凡尘中感悟红尘大道，获得绝世心境。'
  },
  {
    name: '药王谷',
    title: '避世桃源',
    description: '隐世不出的中立区域，草木之灵极其丰富。出生此地自带草药辨识天赋，虽不擅争斗，却能凭借一手医术让各方强者欠下人情。'
  }
];

// 道途设定
export interface PathOption {
  name: string;
  title: string;
  category: '五行本源' | '诸子百艺' | '外道魔门';
  description: string;
}

export const PATHS: PathOption[] = [
  // === 五行本源 ===
  {
    name: '金道',
    title: '庚金杀伐',
    category: '五行本源',
    description: '主修锐气与穿透，攻伐第一。在这个流派眼中，万物皆可斩断，修炼至大成可身化神兵，无坚不摧。'
  },
  {
    name: '木道',
    title: '枯荣生息',
    category: '五行本源',
    description: '掌控生命与毒素的二元对立。既能只要有一口气在便瞬间复原，亦能于无声无息间剥夺方圆百里生机。'
  },
  {
    name: '水道',
    title: '瀚海狂澜',
    category: '五行本源',
    description: '至柔亦至刚，擅长控制与持久战。若修至化境，可抽干敌人体内血液，或掀起灭世洪水淹没尘世。'
  },
  {
    name: '火道',
    title: '焚天炼狱',
    category: '五行本源',
    description: '最为暴裂的毁灭之道。不仅拥有极致的爆发伤害，更是炼丹师与炼器师的基石，以天地为炉，造化万物。'
  },
  {
    name: '土道',
    title: '厚德载物',
    category: '五行本源',
    description: '防御无双，借大地之力镇压万法。立于大地之上便拥有无穷无尽的灵力补给，同阶修士极难破防。'
  },
  // === 诸子百艺 ===
  {
    name: '剑道',
    title: '一剑破万法',
    category: '诸子百艺',
    description: '舍弃花哨法术，唯修一口本命飞剑。追求极致的攻击力与速度，信奉"心中有剑，草木皆兵"，乃是修仙界最帅气也最费钱的流派。'
  },
  {
    name: '武道',
    title: '肉身成圣',
    category: '诸子百艺',
    description: '不修灵气，只修气血。以凡人之躯比肩神明，每一拳都蕴含打碎虚空的怪力，讲究万法不侵，近身即无敌。'
  },
  {
    name: '丹道',
    title: '以药证道',
    category: '诸子百艺',
    description: '战斗力或许平庸，但影响力巨大。通过嗑药强行提升境界，或用毒丹越阶杀敌，是唯一能靠"钱"砸出长生大道的流派。'
  },
  {
    name: '阵道',
    title: '算尽天机',
    category: '诸子百艺',
    description: '以天地山川为棋局。虽然布阵耗时，但一旦阵成，便能借天地大势坑杀千军万马，是智者以弱胜强的首选。'
  },
  // === 外道魔门 ===
  {
    name: '血道',
    title: '滴血重生',
    category: '外道魔门',
    description: '极为邪恶的魔道流派，通过掠夺他人精血提升修为。生存能力极强，哪怕肉身尽毁，只要逃出一滴残血便能卷土重来。'
  },
  {
    name: '杀道',
    title: '以杀止杀',
    category: '外道魔门',
    description: '没有复杂的招式，唯有纯粹的杀意。每斩杀一人，身上的煞气便重一分，攻击力便强一分，最终哪怕眼神都能震碎敌人神魂。'
  },
  {
    name: '鬼道',
    title: '万魂噬心',
    category: '外道魔门',
    description: '整日与尸骸冤魂为伴。擅长御鬼、炼尸、诅咒，手段阴毒诡异，令人防不胜防，但极易遭天谴雷劫。'
  },
  {
    name: '蛊道',
    title: '炼蛊成仙',
    category: '外道魔门',
    description: '视天地为一瓮，众生为蛊虫。通过不断厮杀吞噬，炼制出拥有诡异规则之力的本命蛊虫，手段千变万化，防不胜防。'
  },
  {
    name: '虚空道',
    title: '咫尺天涯',
    category: '外道魔门',
    description: '极其罕见的高位法则。掌控空间之力，瞬移、切割、放逐，在敌人还没反应过来时，头颅已在异度空间。'
  }
];

export const REALMS = [
  '炼气期', '筑基期', '金丹期', '元婴期', '化神期', '炼虚期', '合体期', '大乘期', '渡劫期'
];

// Helper to create rollable attributes
const createAttr = (name: string, grade: AttributeGrade, desc: string, bonuses?: Record<string, string>): AttributeRoll => ({
  name, grade, description: desc, bonuses
});

// 根骨池 (4凡:3灵:2地:1天 = 10个)
export const ROOT_BONES: AttributeRoll[] = [
  // 凡级 x4
  createAttr('凡俗肉身', AttributeGrade.MORTAL, '芸芸众生最常见的体质，杂质颇多，寿元不过百年，修仙之路注定坎坷。'),
  createAttr('经脉淤塞', AttributeGrade.MORTAL, '先天经脉堵塞，气息难行，被世家判定为"修练废柴"，往往受尽白眼。'),
  createAttr('体弱多病', AttributeGrade.MORTAL, '先天元气不足，三步一喘，不宜习武，但或许在悟道上别有机缘？'),
  createAttr('蛮力过人', AttributeGrade.MORTAL, '虽无灵气亲和，但天生神力，能举千斤铜鼎，是凡间猛将的好苗子。'),
  // 灵级 x3
  createAttr('五行灵体', AttributeGrade.SPIRIT, '对金木水火土五行灵气有较好的亲和力，修行速度快于常人，乃宗门内门弟子之资。'),
  createAttr('冰肌玉骨', AttributeGrade.SPIRIT, '肌理细腻，百毒不侵，天生适合修炼阴寒属性功法，气质出尘。'),
  createAttr('剑骨初生', AttributeGrade.SPIRIT, '脊骨如剑，锋芒暗藏，天生对剑道领悟极快，修习剑法事半功倍。'),
  // 地级 x2
  createAttr('九阴绝脉', AttributeGrade.EARTH, '体内蕴含极端的阴之力，若无绝世功法疏导活不过二十岁，一旦大成则惊天动地。'),
  createAttr('金刚不坏', AttributeGrade.EARTH, '肉身强横如法宝，同阶无敌，可硬撼妖兽，乃是体修梦寐以求的极品根骨。'),
  // 天级 x1
  createAttr('荒古圣体', AttributeGrade.HEAVEN, '万古罕见的无上体质，气血如海，万法不侵。大成之时可叫板大帝，只手遮天，唯独在末法时代难以修炼。'),
];

// 男性专属根骨变体
export const ROOT_BONES_MALE_VARIANT: AttributeRoll =
  createAttr('纯阳之体', AttributeGrade.EARTH, '体内蕴含极端的阳之力，若无绝世功法疏导活不过二十岁，一旦大成则惊天动地。');

// 天赋池 (4凡:3灵:2地:1天 = 10个)
export const TALENTS: AttributeRoll[] = [
  // 凡级 x4
  createAttr('耳聪目明', AttributeGrade.MORTAL, '五感比常人略微敏锐，能在嘈杂市井中听清低语，不容易被偷袭。'),
  createAttr('心灵手巧', AttributeGrade.MORTAL, '手指灵活，擅长凡间杂艺，制作符箓或机关时成功率微弱提升。'),
  createAttr('略通医理', AttributeGrade.MORTAL, '久病成医，懂得识别常见草药，野外生存能力略微增加。'),
  createAttr('甚是好运', AttributeGrade.MORTAL, '偶尔能捡到凡人遗失的铜板，运气比普通人好那么一点点。'),
  // 灵级 x3
  createAttr('丹道入门', AttributeGrade.SPIRIT, '对药理有着天然的直觉，炼制丹药时炸炉概率降低，成丹率提升三成。'),
  createAttr('兽语通灵', AttributeGrade.SPIRIT, '天生亲近自然，能模糊感知妖兽情绪，驯养灵宠的概率大幅提升。'),
  createAttr('过目不忘', AttributeGrade.SPIRIT, '神识强大，凡间书籍一扫即通，修仙功法研读速度加倍。'),
  // 地级 x2
  createAttr('伴生异火', AttributeGrade.EARTH, '灵魂深处寄宿着一缕天地异火的火种，既能焚尽万物，亦是炼药无上助力。'),
  createAttr('天生剑心', AttributeGrade.EARTH, '剑心通明，无视心魔干扰。任何剑法看一眼便能领悟其神韵，攻击自带剑意加成。'),
  // 天级 x1
  createAttr('重瞳者', AttributeGrade.HEAVEN, '上古圣人之象，眸生双瞳。天生拥有看破虚妄、解析万法本质的能力，注定走上一条无敌之路，有大帝之资。'),
];

// 灵宝池 (4凡:3灵:2地:1天 = 10个)
export const TREASURES: AttributeRoll[] = [
  // 凡级 x4
  createAttr('锈迹铁剑', AttributeGrade.MORTAL, '一把凡间铁匠铺随处可见的铁剑，剑身满是锈迹，甚至不如烧火棍趁手。'),
  createAttr('粗布储物袋', AttributeGrade.MORTAL, '下等散修使用的储物袋，空间只有方圆一尺，只能装下几件换洗衣物和干粮。'),
  createAttr('祖传玉佩', AttributeGrade.MORTAL, '家族留下的普通玉饰，除了作为信物外，似乎没有任何灵力波动。'),
  createAttr('止血草药', AttributeGrade.MORTAL, '几株凡间常见的草药，嚼碎了敷在伤口上能勉强止血，聊胜于无。'),
  // 灵级 x3
  createAttr('流云飞剑', AttributeGrade.SPIRIT, '宗门制式法器，注入灵力可御空飞行，剑身轻盈，削铁如泥。'),
  createAttr('筑基丹', AttributeGrade.SPIRIT, '修仙界硬通货，凡人跨入修仙门槛的关键丹药，无数散修为此争得头破血流。'),
  createAttr('聚灵阵盘', AttributeGrade.SPIRIT, '刻有小型聚灵阵法的圆盘，展开后可稍微提升周围灵气浓度，加速修炼。'),
  // 地级 x2
  createAttr('玄重尺', AttributeGrade.EARTH, '通体漆黑，无锋无刃，重若千钧。看似笨重，实则不仅能锤炼体魄，更有压制灵力的奇效。'),
  createAttr('万魂幡', AttributeGrade.EARTH, '魔道至宝的仿制品，可收纳亡魂为己用。虽然威力强大，但容易被正道人士追杀。'),
  // 天级 x1
  createAttr('掌天瓶', AttributeGrade.HEAVEN, '平平无奇的墨绿色小瓶，每逢月圆之夜可凝聚神秘绿液。此液能催熟万年灵药，乃是凡人逆天改命、立地成圣的无上至宝。'),
];

export const INITIAL_MESSAGES = [
  "混沌初开，天地灵气复苏...",
  "你感到一阵剧烈的头痛，缓缓睁开双眼。",
  "这里是...？记忆如潮水般涌来。",
];
