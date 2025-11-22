
import { AttributeGrade, AttributeRoll } from './types';

export const RACES = ['人族', '妖族', '古灵族', '修罗族'];
export const REGIONS = ['中州神土', '北冥寒域', '南荒十万大山', '东海蓬莱', '西漠佛国'];
export const PATHS = ['剑道', '丹道', '阵道', '兽道', '魔道', '无情道'];

export const REALMS = [
  '炼气期', '筑基期', '金丹期', '元婴期', '化神期', '炼虚期', '合体期', '大乘期', '渡劫期'
];

// Helper to create rollable attributes
const createAttr = (name: string, grade: AttributeGrade, desc: string, bonuses?: Record<string, string>): AttributeRoll => ({
  name, grade, description: desc, bonuses
});

export const ROOT_BONES: AttributeRoll[] = [
  createAttr('凡人肉胎', AttributeGrade.MORTAL, '平平无奇的肉体，修仙难如登天。'),
  createAttr('五行灵体', AttributeGrade.SPIRIT, '亲和五行灵气，修炼速度尚可。'),
  createAttr('荒古圣体', AttributeGrade.HEAVEN, '肉身成圣，力大无穷，万法不侵。'),
  createAttr('先天道胎', AttributeGrade.DIVINE, '天生近道，悟性极高，乃天选之子。'),
  createAttr('厄难毒体', AttributeGrade.EARTH, '万毒不侵但所过之处生灵涂炭。'),
  createAttr('剑灵之体', AttributeGrade.SPIRIT, '天生剑心，修习剑道事半功倍。'),
];

export const TALENTS: AttributeRoll[] = [
  createAttr('愚钝', AttributeGrade.MORTAL, '七窍通了六窍，一窍不通。'),
  createAttr('过目不忘', AttributeGrade.SPIRIT, '凡书记载，一眼便知。'),
  createAttr('七窍玲珑', AttributeGrade.EARTH, '心思缜密，能推演万物变化。'),
  createAttr('天道酬勤', AttributeGrade.SPIRIT, '虽资质平平，但勤能补拙。'),
  createAttr('悟道之心', AttributeGrade.HEAVEN, '偶入顿悟，直指大道本源。'),
];

export const TREASURES: AttributeRoll[] = [
  createAttr('破旧铁剑', AttributeGrade.MORTAL, '一把生锈的铁剑，切菜都费劲。'),
  createAttr('聚气盘', AttributeGrade.SPIRIT, '稍微加快周围灵气的聚集速度。'),
  createAttr('药老戒指', AttributeGrade.HEAVEN, '戒指里似乎沉睡着一个古老的灵魂。'),
  createAttr('掌天瓶', AttributeGrade.DIVINE, '夺天地造化，催熟万年灵药。'),
  createAttr('山河社稷图(残卷)', AttributeGrade.EARTH, '蕴含空间法则的古老画卷。'),
];

export const INITIAL_MESSAGES = [
  "混沌初开，天地灵气复苏...",
  "你感到一阵剧烈的头痛，缓缓睁开双眼。",
  "这里是...？记忆如潮水般涌来。",
];
