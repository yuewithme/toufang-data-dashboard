# 投放数据看板 API 设计

## 调用原则

前端顶部筛选项变化后自动请求后端并刷新看板，不再需要点击“查询”。重置按钮会恢复默认筛选并重新请求默认数据。

后端取数时必须先过滤源表：`客户群` 字段包含 `代投` 两个字的记录才进入看板统计和原始数据明细。

## 筛选参数

所有看板数据接口都需要支持这些查询参数：

```ts
type DashboardQuery = {
  startDate: string;        // 本期开始日期，YYYY-MM-DD
  endDate: string;          // 本期结束日期，YYYY-MM-DD
  previousStartDate: string;// 上期开始日期，由前端或后端按同等天数计算
  previousEndDate: string;  // 上期结束日期
  rankCount: 5 | 10 | 15 | 20 | 30;
  brandName?: string;       // 品牌/客户名称，模糊匹配
  platform?: '小红书' | '视频号' | '支付宝';
}
```

## 1. 筛选选项接口

用于初始化品牌名称和平台下拉选项。

`GET /api/dashboard/filter-options`

```json
{
  "platforms": ["小红书", "视频号", "支付宝"],
  "brands": ["星河科技", "云启教育", "蓝海医美"]
}
```

前端使用位置：

- `FilterPanel` 的“品牌名称”输入候选项。
- `FilterPanel` 的“平台选择”下拉项。

## 2. 看板汇总接口

用于左侧“消耗数据统计”和“客户数据统计”。

`GET /api/dashboard/summary`

请求参数：`DashboardQuery`

```json
{
  "consumption": {
    "periodTotal": 998000,
    "previousTotal": 1110000,
    "periodDailyAverage": 499000,
    "previousDailyAverage": 555000
  },
  "customers": {
    "periodTotal": 247,
    "previousTotal": 246,
    "periodDailyAverage": 35,
    "previousDailyAverage": 35
  },
  "updatedAt": "2026-06-14 12:38:58"
}
```

前端计算：

- `本期总消耗` 对比 `上期总消耗`，展示百分比。
- `本期日均消耗` 对比 `上期日均消耗`，展示百分比。
- `本期客户量` 对比 `上期客户量`，展示数量差。
- `本期日均客户` 对比 `上期日均客户`，展示数量差。

颜色规则：

- 上升：深红。
- 下降：深绿。
- 不变：灰色。

## 3. 平台客户明细接口

用于右侧“小红书 / 视频号 / 支付宝”三个平台卡片和客户榜单。

`GET /api/dashboard/platform-details`

请求参数：`DashboardQuery`

```json
{
  "platforms": [
    {
      "platform": "小红书",
      "periodConsumption": 915000,
      "periodCustomers": 42,
      "customers": [
        {
          "brandName": "蓝海医美",
          "periodConsumption": 860000,
          "previousConsumption": 757000
        }
      ]
    }
  ]
}
```

前端使用位置：

- 平台卡片顶部：
  - `periodConsumption` -> 本期消耗量。
  - `periodCustomers` -> 本期客户总量。
  - 客户数组长度或请求的 `rankCount` -> `TOP N` 标识。
- 客户列表：
  - 第一行：`brandName`。
  - 第二行：`periodConsumption` + 环比百分比。
  - 第三行：`上期 previousConsumption`。

前端计算：

```ts
change = periodConsumption - previousConsumption
changePercent = previousConsumption === 0 ? 0 : change / previousConsumption * 100
```

颜色规则：

- `change > 0`：消耗量和百分比都用深红。
- `change < 0`：消耗量和百分比都用深绿。
- `change === 0`：消耗量和百分比都用灰色。

## 4. 建议聚合接口

如果后端希望减少请求次数，可以提供一个聚合接口：

`GET /api/dashboard`

请求参数：`DashboardQuery`

```json
{
  "filterOptions": {
    "platforms": ["小红书", "视频号", "支付宝"],
    "brands": ["星河科技", "云启教育", "蓝海医美"]
  },
  "summary": {
    "consumption": {
      "periodTotal": 998000,
      "previousTotal": 1110000,
      "periodDailyAverage": 499000,
      "previousDailyAverage": 555000
    },
    "customers": {
      "periodTotal": 247,
      "previousTotal": 246,
      "periodDailyAverage": 35,
      "previousDailyAverage": 35
    },
    "updatedAt": "2026-06-14 12:38:58"
  },
  "platformDetails": {
    "platforms": [
      {
        "platform": "小红书",
        "periodConsumption": 915000,
        "periodCustomers": 42,
        "customers": [
          {
            "brandName": "蓝海医美",
            "periodConsumption": 860000,
            "previousConsumption": 757000
          }
        ]
      }
    ]
  }
}
```

## 5. 原始数据明细接口

用于点击“原始数据”后查看当前筛选范围内的源表字段。该接口展示明细行，不做汇总，字段需要完整返回，方便核对看板计算来源。

`GET /api/dashboard/raw-data`

请求参数：`DashboardQuery`

```json
{
  "rows": [
    {
      "customerAccountId": "202606140001224992",
      "customerAccountName": "沃虎-蓝海医美",
      "brandName": "蓝海医美",
      "companyEntity": "杭州沃虎网络科技有限公司",
      "agencyAccountName": "小红书聚光乘风--沃虎",
      "customerGroup": "沃虎&蓝海医美小红书代投对接群",
      "nonGiftConsumption": 791200,
      "brandAdGroup": 0,
      "biddingAdGroup": 1,
      "giftConsumption": 68800,
      "returnPointTotal": 1.2,
      "returnPointCash": 1,
      "remark": "重点跟进",
      "consumeDate": "2026-06-14",
      "platform": "小红书"
    }
  ]
}
```

前端使用位置：

- 筛选栏“原始数据”按钮跳转后的表格页。
- 表格展示所有源字段，并额外展示后端归一化后的 `platform` 字段。
- 明细页沿用当前已自动生效的日期、品牌、平台筛选条件。

## 6. 原始数据记录操作接口

原始数据页的复选框用于选择记录，后续对选中记录执行修改或删除。新增、修改只允许操作三个字段：

- `customerGroup`：客户群。
- `nonGiftConsumption`：非赠款消耗。
- `agencyAccountName`：代理商账户名。

`platform` 不是源表字段，禁止前端直接提交平台值。后端必须根据 `agencyAccountName` 按固定映射关系重新计算平台。

### 新增记录

`POST /api/dashboard/raw-data`

请求体：

```json
{
  "customerGroup": "沃虎&适合综合对接群代投",
  "nonGiftConsumption": 1035.91,
  "agencyAccountName": "小红书聚光乘风--沃虎"
}
```

后端处理逻辑：

1. 校验三个字段必填。
2. `nonGiftConsumption` 必须为大于等于 0 的数字。
3. 根据 `agencyAccountName` 计算 `platform`，但 `platform` 只作为返回和聚合字段，不写入原始源表字段。
4. 新增记录如果 `customerGroup` 不包含 `代投`，可以保存到源表，但不会进入看板统计和原始数据默认列表。

响应：

```json
{
  "id": "record_001",
  "platform": "小红书",
  "passesDashboardFilter": true
}
```

### 修改记录

`PATCH /api/dashboard/raw-data/{id}`

请求体：

```json
{
  "customerGroup": "沃虎&适合综合对接群代投",
  "nonGiftConsumption": 1035.91,
  "agencyAccountName": "小红书聚光乘风--沃虎"
}
```

后端处理逻辑：

1. 只允许修改 `customerGroup`、`nonGiftConsumption`、`agencyAccountName` 三个字段。
2. 忽略或拒绝其他字段，例如 `platform`、`brandName`、`consumeDate`、`customerAccountId`。
3. 修改 `agencyAccountName` 后，需要重新按映射关系计算平台。
4. 修改后如果 `customerGroup` 不包含 `代投`，该记录立即不再进入看板统计和原始数据默认列表。

响应：

```json
{
  "id": "record_001",
  "platform": "小红书",
  "passesDashboardFilter": true
}
```

### 删除记录

`DELETE /api/dashboard/raw-data`

请求体：

```json
{
  "ids": ["record_001", "record_002"]
}
```

删除不是物理删除。业务含义是让记录不再通过 `客户群包含代投` 的基础筛选。后端推荐实现方式：

```ts
customerGroup = customerGroup.replaceAll('代投', '')
```

如果源表支持审核状态字段，也可以使用等价方式：

```ts
passesDashboardFilter = false
```

但无论底层如何实现，返回给看板和原始数据默认列表时，这些记录都必须被排除。

响应：

```json
{
  "updatedCount": 2
}
```

## 当前页面需要后端接入的数据清单

- 顶部筛选候选数据：平台列表、品牌/客户名称列表。
- 当前筛选时间范围：本期开始/结束日期、上期开始/结束日期。
- 左侧消耗统计：本期总消耗、上期总消耗、本期日均消耗、上期日均消耗。
- 左侧客户统计：本期客户量、上期客户量、本期日均客户、上期日均客户。
- 右侧平台汇总：每个平台的本期消耗量、本期客户总量。
- 右侧客户榜单：客户名称、本期消耗量、上期消耗量。
- 原始数据明细：源表全部字段，以及后端归一化后的平台字段。
- 原始数据操作：新增、修改、删除记录；新增/修改只提交客户群、非赠款消耗、代理商账户名。
- 页脚更新时间：数据最新同步时间。

## 源表字段映射方案

截图中的数据表可以作为看板的明细源表。前端看板不直接展示每一列，而是按日期、平台、品牌/客户名称聚合后展示。

### 源表字段

```ts
type SourceAdRow = {
  customerAccountId?: string;      // 客户账户ID
  customerAccountName?: string;    // 客户账户名
  brandName: string;               // 品牌名称
  companyEntity: string;           // 公司主体
  agencyAccountName: string;       // 代理商账户名
  customerGroup: string;           // 客户群
  nonGiftConsumption: number;      // 非赠款消耗
  brandAdGroup: number;            // 品牌广告组
  biddingAdGroup: number;          // 竞价广告组
  giftConsumption: number;         // 赠款消耗
  returnPointTotal: number;        // 返点（货点）
  returnPointCash: number;         // 返点（现金点）
  remark?: string;                 // 备注
  consumeDate: string;             // 消耗日期，YYYY-MM-DD
}
```

### 字段对应关系

| 源表字段 | 接口字段 | 前端位置 | 处理规则 |
| --- | --- | --- | --- |
| `品牌名称` | `brandName` | 品牌名称筛选、右侧客户名称 | 作为当前页面的“品牌/客户”主维度。筛选时支持模糊匹配。 |
| `消耗日期` | `consumeDate` | 日期范围筛选 | 按本期日期范围和上期日期范围分别过滤。 |
| `非赠款消耗` | `nonGiftConsumption` | 本期/上期消耗量、原始数据表 | 当前页面唯一消耗口径，所有消耗统计都只使用该字段。 |
| `赠款消耗` | `giftConsumption` | 原始数据表 | 当前页面暂不计入消耗统计，仅作为原始字段展示。 |
| `代理商账户名` | `agencyAccountName` / `platform` | 平台选择、小红书/视频号/支付宝分组 | 按固定映射表归一化为平台名称。 |
| `客户账户名` | `customerAccountName` | 备用客户标识 | 当前页面优先展示品牌名称；品牌名为空时可回退显示客户账户名。 |
| `客户账户ID` | `customerAccountId` | 数据去重、明细追踪 | 不直接展示，用于后端明细去重和排查。 |
| `客户群` | `customerGroup` | 后端取数筛选、原始数据表 | 只有包含 `代投` 的记录进入统计；不满足条件的记录全部排除。 |
| `公司主体` | `companyEntity` | 可选筛选条件 | 当前页面顶部公司名固定；后续多主体时可作为筛选项。 |
| `品牌广告组` | `brandAdGroup` | 可选指标 | 当前页面暂不展示，可用于广告组结构分析。 |
| `竞价广告组` | `biddingAdGroup` | 可选指标 | 当前页面暂不展示，可用于广告组结构分析。 |
| `返点（货点）` | `returnPointTotal` | 可选财务指标 | 当前页面暂不展示。 |
| `返点（现金点）` | `returnPointCash` | 可选财务指标 | 当前页面暂不展示。 |
| `备注` | `remark` | 可选明细字段 | 当前页面暂不展示。 |

### 数据取数筛选规则

进入看板统计和原始数据页的源表记录必须满足：

```ts
row.customerGroup.includes('代投')
```

该规则属于后端基础取数条件，优先级高于页面日期、品牌、平台等筛选条件。

### 平台归一化规则

源表里没有直接的“平台”字段，必须按 `代理商账户名` 建立固定映射关系。建议后端统一输出平台字段，避免前端做字符串判断。

| 代理商账户名 | 平台 |
| --- | --- |
| `支付宝-沃虎` | `支付宝` |
| `小红书聚光乘风--沃虎` | `小红书` |
| `小红书品专--沃虎` | `小红书` |
| `腾讯视频号--沃虎` | `视频号` |

```ts
function normalizePlatform(row: SourceAdRow): '小红书' | '视频号' | '支付宝' | '其他' {
  const platformMap = {
    '支付宝-沃虎': '支付宝',
    '小红书聚光乘风--沃虎': '小红书',
    '小红书品专--沃虎': '小红书',
    '腾讯视频号--沃虎': '视频号',
  } as const;

  return platformMap[row.agencyAccountName as keyof typeof platformMap] ?? '其他';
}
```

### 页面计算口径

#### 本期消耗

```ts
periodConsumption = sum(nonGiftConsumption)
where consumeDate between startDate and endDate
and customerGroup includes '代投'
and platform matches selected platform if provided
and brandName fuzzy matches selected brandName if provided
```

#### 上期消耗

```ts
previousConsumption = sum(nonGiftConsumption)
where consumeDate between previousStartDate and previousEndDate
and customerGroup includes '代投'
and uses the same platform / brand filters
```

#### 本期客户量

```ts
periodCustomers = countDistinct(brandName || customerAccountId)
where periodConsumption > 0
```

#### 上期客户量

```ts
previousCustomers = countDistinct(brandName || customerAccountId)
where previousConsumption > 0
```

#### 日均消耗

```ts
periodDailyAverage = round(periodConsumption / periodDays)
previousDailyAverage = round(previousConsumption / previousDays)
```

#### 日均客户

```ts
periodDailyAverageCustomers = round(periodCustomers / periodDays)
previousDailyAverageCustomers = round(previousCustomers / previousDays)
```

#### 右侧平台卡片

每个平台卡片的数据都必须从同一批过滤后的源表聚合：

```ts
platform.periodConsumption = sum(nonGiftConsumption by platform)
platform.periodCustomers = countDistinct(brandName || customerAccountId by platform)
platform.customers = group by brandName, then sum periodConsumption and previousConsumption
```

客户榜单排序：

```ts
customers.sort((a, b) => b.periodConsumption - a.periodConsumption)
customers.slice(0, rankCount)
```

### 建议后端聚合 SQL 口径

以下是伪 SQL，实际字段名按数据库表结构替换：

```sql
SELECT
  normalized_platform AS platform,
  COALESCE(brand_name, customer_account_name, customer_account_id) AS brand_name,
  SUM(CASE WHEN consume_date BETWEEN :startDate AND :endDate
      THEN non_gift_consumption ELSE 0 END) AS period_consumption,
  SUM(CASE WHEN consume_date BETWEEN :previousStartDate AND :previousEndDate
      THEN non_gift_consumption ELSE 0 END) AS previous_consumption
FROM ad_consumption_daily
WHERE consume_date BETWEEN :previousStartDate AND :endDate
  AND customer_group LIKE '%代投%'
  AND (:platform IS NULL OR normalized_platform = :platform)
  AND (:brandName IS NULL OR brand_name LIKE CONCAT('%', :brandName, '%'))
GROUP BY normalized_platform, COALESCE(brand_name, customer_account_name, customer_account_id);
```

后端返回给前端前，再按平台聚合出：

- 平台本期消耗：`sum(period_consumption)`
- 平台本期客户总量：`count(period_consumption > 0)`
- 页面总消耗：所有平台 `period_consumption` 求和
- 页面总客户量：所有平台客户去重计数，建议按 `brandName || customerAccountId`

## 暂时仍可前端配置的数据

- 公司名称：杭州沃虎科技有限公司。
- 平台颜色主题：小红书红、视频号绿、支付宝蓝。
- 排行数量选项：5、10、15、20、30。
