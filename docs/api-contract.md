# 投放数据看板 API 设计

## 调用原则

前端顶部筛选项先保存在草稿状态，只有点击“查询”后才请求后端并刷新看板。重置按钮会恢复默认筛选并重新请求默认数据。

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

## 当前页面需要后端接入的数据清单

- 顶部筛选候选数据：平台列表、品牌/客户名称列表。
- 当前筛选时间范围：本期开始/结束日期、上期开始/结束日期。
- 左侧消耗统计：本期总消耗、上期总消耗、本期日均消耗、上期日均消耗。
- 左侧客户统计：本期客户量、上期客户量、本期日均客户、上期日均客户。
- 右侧平台汇总：每个平台的本期消耗量、本期客户总量。
- 右侧客户榜单：客户名称、本期消耗量、上期消耗量。
- 页脚更新时间：数据最新同步时间。

## 暂时仍可前端配置的数据

- 公司名称：杭州沃虎科技有限公司。
- 平台颜色主题：小红书红、视频号绿、支付宝蓝。
- 排行数量选项：5、10、15、20、30。
