export interface TopListItem {
  rank: number;
  name: string;
  value: string;
  change: string;
  isUp: boolean;
}

export interface PlatformCustomerItem {
  name: string;
  consumption: number;
  previousConsumption?: number;
}

export interface PlatformPerformance {
  name: string;
  accentColor: "red" | "green" | "blue";
  periodConsumption: number;
  periodCustomers: number;
  customers: PlatformCustomerItem[];
}

export interface DashboardData {
  companyName: string;
  target: string;
  yoy: string;
  predictedCompletion: string;
  currentCompletionRate: string;
  timeProgress: string;
  actualAmount: string;
  doubleMonthTarget: string;
  actualConsumption: string;
  last7DayAvg: string;
  prev7DayAvg: string;
  wowChange: string;
  activeCustomers: number;
  periodConsumption: number;
  previousPeriodConsumption: number;
  periodAverageConsumption: number;
  previousPeriodAverageConsumption: number;
  periodCustomers: number;
  previousPeriodCustomers: number;
  periodAverageCustomers: number;
  previousPeriodAverageCustomers: number;
  lists: {
    title: string;
    subtitle: string;
    items: TopListItem[];
  }[];
  platformPerformance: PlatformPerformance[];
}

export type DateRangeFilters = {
  startDate: string;
  endDate: string;
  previousStartDate: string;
  previousEndDate: string;
  selectedPlatform?: string;
  brandName?: string;
};

export interface RawSourceDataRow {
  customerAccountId: string;
  customerAccountName: string;
  brandName: string;
  companyEntity: string;
  agencyAccountName: string;
  customerGroup: string;
  nonGiftConsumption: number;
  brandAdGroup: number;
  biddingAdGroup: number;
  giftConsumption: number;
  returnPointTotal: number;
  returnPointCash: number;
  remark: string;
  consumeDate: string;
  platform: string;
}

const customerNames = [
  "猫小乐", "海氏Hauswirt", "造物者CREATOR", "NOJI个护", "舒芙茵", "BABI", "Girlcult构奇", "DPDP", "三资堂CENSTO",
  "法芮森洗护", "一只驴屎官", "小聪明兜兜", "植场大师日用", "Evers", "咖皇", "诚实的薯薯", "女儿红酱酒",
  "启初Giving", "屋卫仕旗舰店", "泰夕奇家清", "KAZOO可逐美妆", "蒂洛薇", "植场大师家居", "KAZOO可逐护肤",
  "海尔智家", "Pethere萌宠在", "卡萨帝", "蒂洛薇化妆品", "静优学", "最新互联网副业",
  "伊禾本电子商务", "火星人集成厨电", "诗佩妮SPENNY种草集",
  "顾家家居", "LittleOndine/小奥汀", "草本初色幽兰", "小野和子", "百雀羚", "eLL", "Judydoll橘朵", "海尔热水器"
];

const generateItems = (count: number, unit: string, prefix: string = "") => {
  return Array.from({ length: count }).map((_, i) => ({
    rank: i + 1,
    name: customerNames[i % customerNames.length],
    value: `${prefix}${(Math.random() * 10 + 1).toFixed(1)}${unit}`,
    change: `${(Math.random() * 5).toFixed(1)}万`,
    isUp: Math.random() > 0.4
  }));
};

export const mockDashboardData: DashboardData = {
  companyName: "杭州沃虎科技有限公司",
  target: "¥9,270.2万",
  yoy: "+48.0%",
  predictedCompletion: "68.0%",
  currentCompletionRate: "42.2%",
  timeProgress: "63.9%",
  actualAmount: "¥6,300.4万",
  doubleMonthTarget: "¥9,270.2万",
  actualConsumption: "¥3,915.0万",
  last7DayAvg: "¥108.4万",
  prev7DayAvg: "¥111.5万",
  wowChange: "-2.7%",
  activeCustomers: 247,
  periodConsumption: 998000,
  previousPeriodConsumption: 1110000,
  periodAverageConsumption: 499000,
  previousPeriodAverageConsumption: 555000,
  periodCustomers: 247,
  previousPeriodCustomers: 246,
  periodAverageCustomers: 35,
  previousPeriodAverageCustomers: 35,
  lists: [
    {
      title: "昨日消耗 TOP30",
      subtitle: "6.8 单日消耗 Top30",
      items: generateItems(30, "万", "¥")
    },
    {
      title: "增量 TOP30",
      subtitle: "6.8 vs 6.7 日环比",
      items: generateItems(30, "万", "+")
    },
    {
      title: "掉量 TOP30",
      subtitle: "6.8 vs 6.7 日环比",
      items: generateItems(30, "万", "-")
    },
    {
      title: "新增客户",
      subtitle: "6.8 vs 6.7 日环比",
      items: generateItems(30, "万", "¥")
    },
    {
      title: "年同比增量 TOP30",
      subtitle: "6.8 vs 去年同天 6.8",
      items: generateItems(30, "万", "+")
    },
    {
      title: "年同比掉量 TOP30",
      subtitle: "6.8 vs 去年同天 6.8",
      items: generateItems(30, "万", "-")
    }
  ],
  // 变更原因：右侧红框区域需要按参考图展示三平台模块，并使用固定图片数据替代随机榜单。
  platformPerformance: [
    {
      name: "小红书",
      accentColor: "red",
      periodConsumption: 915000,
      periodCustomers: 42,
      customers: [
        { name: "星河科技", consumption: 190000 },
        { name: "云启教育", consumption: 120000 },
        { name: "蓝海医美", consumption: 860000 },
        { name: "智达家居", consumption: 680000 },
        { name: "华耀电商", consumption: 530000 },
        { name: "恒巨传媒", consumption: 470000 },
        { name: "瑞森教育", consumption: 390000 },
        { name: "青柠母婴", consumption: 355000 },
        { name: "未来家电", consumption: 326000 },
        { name: "栖云美妆", consumption: 298000 },
        { name: "橙光生活", consumption: 256000 },
        { name: "启航旅游", consumption: 218000 },
        { name: "初见服饰", consumption: 176000 },
        { name: "元启食品", consumption: 143000 },
        { name: "漫野户外", consumption: 112000 },
        { name: "七月花艺", consumption: 98000 },
        { name: "澄心母婴", consumption: 86000 },
        { name: "谷雨个护", consumption: 79000 },
        { name: "拾光摄影", consumption: 73000 },
        { name: "清禾服饰", consumption: 68000 },
        { name: "南枝家纺", consumption: 62000 },
        { name: "鲸选食品", consumption: 57000 },
        { name: "青藤教育", consumption: 52000 },
        { name: "星悦美甲", consumption: 47000 },
        { name: "本初茶饮", consumption: 42000 },
        { name: "知夏运动", consumption: 38000 },
        { name: "乐眠家居", consumption: 33000 },
        { name: "晴屿旅行", consumption: 29000 },
        { name: "云杉数码", consumption: 24000 },
        { name: "微澜生活", consumption: 19000 }
      ]
    },
    {
      name: "视频号",
      accentColor: "green",
      periodConsumption: 562000,
      periodCustomers: 37,
      customers: [
        { name: "新锐汽车", consumption: 116000 },
        { name: "康元健康", consumption: 94000 },
        { name: "墨白服饰", consumption: 72000 },
        { name: "飞越本地生活", consumption: 59000 },
        { name: "启明咨询", consumption: 48000 },
        { name: "润庭家居", consumption: 36000 },
        { name: "迅捷服务", consumption: 31000 },
        { name: "赤焰体育", consumption: 29000 },
        { name: "轻舟出行", consumption: 26000 },
        { name: "森屿咖啡", consumption: 24000 },
        { name: "长风数码", consumption: 21000 },
        { name: "喜禾餐饮", consumption: 18000 },
        { name: "觅光摄影", consumption: 16000 },
        { name: "万象商贸", consumption: 13000 },
        { name: "悦动健身", consumption: 12000 },
        { name: "松果亲子", consumption: 11000 },
        { name: "青云教育", consumption: 10000 },
        { name: "云里花店", consumption: 9500 },
        { name: "北岸家居", consumption: 9000 },
        { name: "橙意传媒", consumption: 8500 },
        { name: "乐活食品", consumption: 8000 },
        { name: "明日出行", consumption: 7600 },
        { name: "白鹿服装", consumption: 7200 },
        { name: "海岚美妆", consumption: 6800 },
        { name: "一禾母婴", consumption: 6400 },
        { name: "星途科技", consumption: 6000 },
        { name: "风禾餐饮", consumption: 5600 },
        { name: "浅草护理", consumption: 5200 },
        { name: "知野户外", consumption: 4800 },
        { name: "木棉生活", consumption: 4400 }
      ]
    },
    {
      name: "支付宝",
      accentColor: "blue",
      periodConsumption: 435000,
      periodCustomers: 42,
      customers: [
        { name: "明德教育", consumption: 101000 },
        { name: "汇鑫金融", consumption: 89000 },
        { name: "绿洲零售", consumption: 65000 },
        { name: "安心服务", consumption: 52000 },
        { name: "远航旅游", consumption: 39000 },
        { name: "佳禾餐饮", consumption: 32000 },
        { name: "晨光科技", consumption: 28000 },
        { name: "蓝鲸运动", consumption: 26000 },
        { name: "星芒传媒", consumption: 23000 },
        { name: "山海家装", consumption: 21000 },
        { name: "晴川教育", consumption: 19000 },
        { name: "北辰汽车", consumption: 17000 },
        { name: "银杏护理", consumption: 15000 },
        { name: "星野露营", consumption: 12000 },
        { name: "深蓝数科", consumption: 11000 },
        { name: "云帆保险", consumption: 10000 },
        { name: "知行培训", consumption: 9300 },
        { name: "海棠医美", consumption: 8700 },
        { name: "晨星母婴", consumption: 8100 },
        { name: "柏悦家居", consumption: 7500 },
        { name: "林间咖啡", consumption: 7000 },
        { name: "蓝桥出行", consumption: 6600 },
        { name: "向阳公益", consumption: 6200 },
        { name: "云朵摄影", consumption: 5800 },
        { name: "正和法务", consumption: 5400 },
        { name: "小满零售", consumption: 5000 },
        { name: "青柚教育", consumption: 4600 },
        { name: "新岸健康", consumption: 4200 },
        { name: "朗月家政", consumption: 3800 },
        { name: "南星食品", consumption: 3400 }
      ]
    }
  ]
};

const platformDailyMultipliers: Record<string, Record<string, number>> = {
  "2026-06-13": {
    "小红书": 0.92,
    "视频号": 1.08,
    "支付宝": 0.96,
  },
  "2026-06-14": {
    "小红书": 1,
    "视频号": 1,
    "支付宝": 1,
  },
  // 变更原因：需要支持今天和明天的日期选择联动，这里先用稳定 mock 倍率模拟不同日期的数据波动。
  "2026-06-15": {
    "小红书": 1.16,
    "视频号": 0.88,
    "支付宝": 1.24,
  },
  "2026-06-16": {
    "小红书": 0.81,
    "视频号": 1.31,
    "支付宝": 1.12,
  },
};

const toDate = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getRangeDates = (startDate: string, endDate: string) => {
  const start = toDate(startDate);
  const end = toDate(endDate);
  const dates: string[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    dates.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

const getCustomerFactor = (name: string, dateKey: string) => {
  const seed = Array.from(`${name}${dateKey}`).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 0.86 + (seed % 29) / 100;
};

const getDailyConsumption = (baseConsumption: number, platform: string, customerName: string, dateKey: string) => {
  const platformMultiplier = platformDailyMultipliers[dateKey]?.[platform] ?? 0;
  if (platformMultiplier === 0) return 0;

  return Math.round((baseConsumption * platformMultiplier * getCustomerFactor(customerName, dateKey)) / 1000) * 1000;
};

const sourceDateKeys = Object.keys(platformDailyMultipliers).sort();

const platformAgencyAccount: Record<string, string> = {
  "小红书": "小红书聚光乘风账户",
  "视频号": "视频号磁力投放账户",
  "支付宝": "支付宝数字营销账户",
};

const platformCompanyEntity: Record<string, string> = {
  "小红书": "杭州沃虎网络科技有限公司",
  "视频号": "杭州沃虎科技有限公司",
  "支付宝": "杭州沃虎数智营销有限公司",
};

const getStableSeed = (value: string) => Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0);

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const createMockSourceRows = (): RawSourceDataRow[] => {
  return mockDashboardData.platformPerformance.flatMap((platform) =>
    sourceDateKeys.flatMap((dateKey) =>
      platform.customers.map((customer, customerIndex) => {
        const seed = getStableSeed(`${platform.name}${customer.name}${dateKey}`);
        const grossConsumption = getDailyConsumption(customer.consumption, platform.name, customer.name, dateKey);
        const hasGiftConsumption = seed % 6 === 0;
        const giftConsumption = hasGiftConsumption ? Math.round(grossConsumption * 0.08) : 0;
        const nonGiftConsumption = Math.max(grossConsumption - giftConsumption, 0);

        return {
          customerAccountId: `${dateKey.replace(/-/g, "")}${String(customerIndex + 1).padStart(4, "0")}${seed}`,
          customerAccountName: `沃虎-${customer.name}`,
          brandName: customer.name,
          companyEntity: platformCompanyEntity[platform.name] ?? "杭州沃虎科技有限公司",
          agencyAccountName: platformAgencyAccount[platform.name] ?? `${platform.name}投放账户`,
          customerGroup: `沃虎&${customer.name}${platform.name}对接群`,
          nonGiftConsumption,
          brandAdGroup: seed % 3 === 0 ? 1 : 0,
          biddingAdGroup: seed % 4 === 0 ? 1 : 0,
          giftConsumption,
          returnPointTotal: roundMoney(1.15 + (seed % 8) / 100),
          returnPointCash: 1,
          remark: seed % 5 === 0 ? "重点跟进" : "",
          consumeDate: dateKey,
          platform: platform.name,
        };
      }),
    ),
  );
};

export const mockSourceRows: RawSourceDataRow[] = createMockSourceRows();

export const getRawSourceRows = (filters?: Partial<DateRangeFilters>) => {
  const normalizedBrandName = filters?.brandName?.trim() ?? "";

  return mockSourceRows
    .filter((row) => !filters?.startDate || row.consumeDate >= filters.startDate)
    .filter((row) => !filters?.endDate || row.consumeDate <= filters.endDate)
    .filter((row) => !filters?.selectedPlatform || row.platform === filters.selectedPlatform)
    .filter((row) => !normalizedBrandName || row.brandName.includes(normalizedBrandName))
    .sort((a, b) => {
      if (a.consumeDate !== b.consumeDate) return b.consumeDate.localeCompare(a.consumeDate);
      if (a.platform !== b.platform) return a.platform.localeCompare(b.platform);
      return (b.nonGiftConsumption + b.giftConsumption) - (a.nonGiftConsumption + a.giftConsumption);
    });
};

const getTotalConsumption = (row: RawSourceDataRow) => row.nonGiftConsumption + row.giftConsumption;

const aggregatePlatformCustomers = (platform: PlatformPerformance, dates: string[], brandName = "") => {
  const normalizedBrandName = brandName.trim();
  const dateSet = new Set(dates);
  const rows = mockSourceRows.filter((row) =>
    row.platform === platform.name &&
    dateSet.has(row.consumeDate) &&
    (!normalizedBrandName || row.brandName.includes(normalizedBrandName)),
  );
  const consumptionByBrand = new Map<string, number>();

  rows.forEach((row) => {
    consumptionByBrand.set(row.brandName, (consumptionByBrand.get(row.brandName) ?? 0) + getTotalConsumption(row));
  });

  return Array.from(consumptionByBrand.entries())
    .map(([name, consumption]) => ({ name, consumption }))
    .sort((a, b) => b.consumption - a.consumption)
    .filter((customer) => customer.consumption > 0);
};

export const buildDashboardData = (filters: DateRangeFilters): DashboardData => {
  const periodDates = getRangeDates(filters.startDate, filters.endDate);
  const previousDates = getRangeDates(filters.previousStartDate, filters.previousEndDate);
  const dayCount = Math.max(periodDates.length, 1);
  const previousDayCount = Math.max(previousDates.length, 1);
  const sourcePlatforms = filters.selectedPlatform
    ? mockDashboardData.platformPerformance.filter((platform) => platform.name === filters.selectedPlatform)
    : mockDashboardData.platformPerformance;

  const platformPerformance = sourcePlatforms.map((platform) => {
    const currentCustomers = aggregatePlatformCustomers(platform, periodDates, filters.brandName);
    const previousCustomers = aggregatePlatformCustomers(platform, previousDates, filters.brandName);
    const previousByName = new Map(previousCustomers.map((customer) => [customer.name, customer.consumption]));
    const currentWithPrevious = currentCustomers.map((customer) => ({
      ...customer,
      previousConsumption: previousByName.get(customer.name) ?? 0,
    }));

    return {
      ...platform,
      periodConsumption: currentWithPrevious.reduce((total, customer) => total + customer.consumption, 0),
      periodCustomers: currentWithPrevious.length,
      customers: currentWithPrevious,
    };
  });

  const previousPlatformPerformance = sourcePlatforms.map((platform) => {
    const customers = aggregatePlatformCustomers(platform, previousDates, filters.brandName);

    return {
      ...platform,
      periodConsumption: customers.reduce((total, customer) => total + customer.consumption, 0),
      periodCustomers: customers.length,
      customers,
    };
  });

  const periodConsumption = platformPerformance.reduce((total, platform) => total + platform.periodConsumption, 0);
  const previousPeriodConsumption = previousPlatformPerformance.reduce((total, platform) => total + platform.periodConsumption, 0);
  const periodCustomers = platformPerformance.reduce((total, platform) => total + platform.periodCustomers, 0);
  const previousPeriodCustomers = previousPlatformPerformance.reduce((total, platform) => total + platform.periodCustomers, 0);

  return {
    ...mockDashboardData,
    periodConsumption,
    previousPeriodConsumption,
    periodAverageConsumption: Math.round(periodConsumption / dayCount),
    previousPeriodAverageConsumption: Math.round(previousPeriodConsumption / previousDayCount),
    periodCustomers,
    previousPeriodCustomers,
    periodAverageCustomers: Math.round(periodCustomers / dayCount),
    previousPeriodAverageCustomers: Math.round(previousPeriodCustomers / previousDayCount),
    platformPerformance,
  };
};
