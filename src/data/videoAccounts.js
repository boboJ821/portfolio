const asusProfile =
  'https://www.douyin.com/user/MS4wLjABAAAAmL2WmTrPrmvnb2_CSxgYGgCNCJUE6y7Qi-XxZxZoWoU'
const personalProfile =
  'https://www.douyin.com/user/MS4wLjABAAAAGCeiL3ihzd6QXPzPRJuoA2CXMmLMVk9xqap-qPOx2At7Q-d1WaGylayaxkDjE3zF'

export const videoAccounts = [
  {
    id: 'asus',
    name: '华硕锐达DIY电脑专卖店',
    type: '店铺账号 / 主案例',
    image: '/douyin/IMG_8351.PNG',
    url: 'https://v.douyin.com/hPZQKgxovYA/',
    description:
      '完成从 0 到 1 的账号搭建。在 HKC 与飞利浦交接团队后，以该账号为工作重心，负责内容制作与投流全链路。',
    scope: '选题、脚本、拍摄、剪辑、发布、投流',
    followers: '2.0 万',
    likes: '7.4 万',
    works: [
      '7569929018187713802',
      '7571405464530263654',
      '7540199790676561191',
      '7593652501719979625',
      '7612570432482364715',
      '7565398258090478863',
      '7555756295682067722',
      '7555691324239514889',
      '7575100102487766666',
      '7565746582390361396',
      '7552439022636764462',
    ].map((id, index) => ({
      id,
      title: index === 0 ? 'EXPO 开启教程' : `代表作品 ${String(index + 1).padStart(2, '0')}`,
      url: `${asusProfile}?modal_id=${id}`,
    })),
  },
  {
    id: 'personal',
    name: '正正装机日记',
    type: '个人 IP / 同期搭建',
    image: '/douyin/IMG_8352.PNG',
    url: 'https://v.douyin.com/YCvMd06LpsM/',
    description:
      '在主攻华硕店铺内容的同时，从 0 到 1 搭建装机类个人 IP，负责从选题到发布、投流的完整制作链路。',
    scope: '选题、脚本、拍摄、剪辑、发布、投流',
    followers: '6,013',
    likes: '1.4 万',
    works: ['7680741092379168046', '7669684922373672243', '7669022564991227758'].map(
      (id, index) => ({
        id,
        title: `代表作品 ${String(index + 1).padStart(2, '0')}`,
        url: `${personalProfile}?modal_id=${id}`,
      }),
    ),
  },
  {
    id: 'hkc',
    name: 'HKC数码旗舰店',
    type: '店铺账号 / 初期搭建',
    image: '/douyin/IMG_8349.PNG',
    url: 'https://v.douyin.com/ehNuIOF9BRY/',
    description:
      '最早负责的数码视频账号，从 0 到 1 建立内容制作与发布链路，后续交接给视频部下属持续运营。',
    scope: '前期全链路执行、账号搭建与团队交接',
    followers: '1.5 万',
    likes: '1.0 万',
    works: [],
  },
  {
    id: 'philips',
    name: '飞利浦电竞显示器',
    type: '店铺账号 / 后续交接',
    image: '/douyin/IMG_8350.PNG',
    url: 'https://v.douyin.com/baYV0yk8UJA/',
    description:
      '继 HKC 之后，从 0 到 1 搭建显示器店铺账号，负责选题到投流，随后交接给视频部下属。',
    scope: '前期全链路执行、账号搭建与团队交接',
    followers: '2,236',
    likes: '3,078',
    works: [],
  },
]

export const videoEvidence = [
  {
    id: 'content',
    title: '单条作品 · 内容表现',
    image: '/douyin/屏幕截图 2026-07-31 132245.png',
    note: 'EXPO 教程后台截图；部分指标标注更新至 2026-02-05，非实时统计。',
  },
  {
    id: 'list',
    title: '作品管理 · 数据补充',
    image: '/douyin/屏幕截图 2026-07-31 132304.png',
    note: '与单条详情的显示精度、更新口径可能不同，不将两张截图的数值混用。',
  },
  {
    id: 'ads',
    title: '商品全域投放',
    image: '/douyin/屏幕截图 2026-07-31 141749.png',
    note: '华硕锐达 · 2026-05-14 至 2026-06-18。店铺整体投放口径，不能直接归因于单条视频。',
  },
  {
    id: 'commerce',
    title: '618 短视频概览',
    image: '/douyin/屏幕截图 2026-07-31 142050.png',
    note: '华硕锐达 · 2026 年 618 活动期 05-15 至 06-18。支付金额与退款金额分别展示，不代表净收入或个人独立贡献。',
  },
]
