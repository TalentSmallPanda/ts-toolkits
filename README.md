# ts-toolkits

[![npm version](https://img.shields.io/npm/v/ts-toolkits.svg)](https://www.npmjs.com/package/ts-toolkits)
[![npm downloads](https://img.shields.io/npm/dm/ts-toolkits.svg)](https://www.npmjs.com/package/ts-toolkits)
[![license](https://img.shields.io/npm/l/ts-toolkits.svg)](https://github.com/TalentSmallPanda/ts-toolkits/blob/master/LICENSE)

一个功能强大的 TypeScript 工具库，提供了丰富的数组、树形结构、查询、排序、字符串、对象和随机数据生成等实用工具函数。

## ✨ 特性

- 🎯 **TypeScript 优先**：完整的类型定义和类型推断
- 🔥 **功能丰富**：13个工具类，覆盖常见开发场景
- 🚀 **性能优化**：分块处理、归并排序等高效算法
- 📦 **按需引入**：支持 Tree-shaking
- ✅ **测试完善**：高测试覆盖率
- 🌳 **树形结构专家**：强大的树形数据处理能力

## 📦 安装

```bash
npm install ts-toolkits
# 或
yarn add ts-toolkits
# 或
pnpm add ts-toolkits
```

## 🚀 快速开始

```typescript
import { ArrayUtils, TreeUtils, QueryUtils, SortUtils, StringUtils } from 'ts-toolkits';

// 数组操作
const arr = [1, 2, 3, 4, 5];
ArrayUtils.take(arr, 3); // [1, 2, 3]
ArrayUtils.isEmpty([]); // true

// 字符串操作
StringUtils.snakeCase('helloWorld'); // 'hello_world'
StringUtils.isEmpty('  '); // false
StringUtils.isBlank('  '); // true

// 查询操作
const users = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 }
];
QueryUtils.queryChunk(users, [
  { field: 'age', operator: Operator.GREATER_THAN, value: 20 }
]);
```

## 📚 功能特性

### 🔸 数组工具 (ArrayUtils)
- 数组判空检查 (`isEmpty`, `isNotEmpty`)
- 数组元素查找 (`contains`, `containsAny`)
- 数组元素插入/删除 (`insert`, `remove`)
- 数组切片操作 (`take`, `takeRight`)
- 数值数组最大/最小值查找 (`max`, `min`)

### 🔸 字符串工具 (StringUtils)
- 空白检查 (`isEmpty`, `isBlank`, `isNotEmpty`, `isNotBlank`)
- 修剪操作 (`trim`, `trimToNull`, `trimToEmpty`)
- 字符剥离 (`strip`, `stripStart`, `stripEnd`)
- 字符串比较 (`equals`, `equalsIgnoreCase`)
- 搜索操作 (`indexOf`, `lastIndexOf`, `contains`)
- 子串操作 (`subString`, `startWith`, `endWith`)
- 工具方法 (`newGuid`, `snakeCase`, `replaceAll`, `join`)

### 🔸 对象工具 (ObjectUtils)
- 类型检查 (`isNull`, `isUndefined`, `isNullOrUndefined`)
- 类型判断 (`isArray`, `isDate`, `isString`, `isNumber`, `isBoolean`, `isFunction`, `isPromise`, `isRegExp`)
- 属性操作 (`getProperty`, `setProperty`)
- 深度属性访问 (`getDescendantProperty`)
- 默认值处理 (`getOrDefault`)
- 类型安全的值检查 (`hasValue`)

### 🔸 数字工具 (NumberUtils)
- 数字类型检查 (`isInteger`, `isSafeInteger`)
- 数值字符串检查 (`isNumeric` - 支持 "123" 等数字字符串)
- 数值格式化 (`toFixed`)
  
### 🌳 树形结构工具 (TreeUtils)
- 树形数据初始化 (`initTree`, `initFlatTree`)
- 树形数据创建 (`createTree` - 支持随机数据生成，支持12种字段类型)
- 展开/收起节点控制 (`expandTree`)
- 列表转树形结构 (`handleListToTree`)
- 树节点查找 (`getTreeItemByIdxs`)
- 树节点更新 (`updateTreeItemByIdxs`, `updateTreeItemsByIdxs`)
- 树节点删除 (`deleteTreeItemByIdxs`, `deleteTreeItemsByIdxs`)

### 🔍 查询工具 (QueryUtils)
- **18种操作符支持**：`EQUAL`, `NOT_EQUAL`, `GREATER_THAN`, `LESS_THAN`, `CONTAINS`, `IN`, `BETWEEN`, `REGEX` 等
- **复杂数据查询**：支持条件组合、分块处理、递归子项查询
- **逻辑组合**：AND/OR 逻辑
- **分块处理**：支持大数据量分批次查询
- **递归查询**：自动处理嵌套子项（如树形结构）
- **自定义比较**：支持自定义比较函数

### 🔸 排序工具 (SortUtils)
- **排序算法**：基于归并排序的稳定排序（O(n log n)）
- **多字段排序**：支持多级排序键（支持嵌套属性路径）
- **递归子元素排序**：自动对嵌套子项（如树形结构）进行排序
- **自定义比较逻辑**：通过 `compare` 函数实现复杂排序规则
- **条件跳过字段**：通过 `skipIf` 函数跳过特定条件的字段比较
- **值转换**：通过 `transform` 函数在比较前转换值
- **排序方向控制**：支持升序（ASC）和降序（DESC）

### 🎲 随机生成工具 (RandomUtils)
- 基础类型：`getInt`, `getFloat`, `getBoolean`, `getString`
- 颜色：`getColor` (16进制格式)
- 日期：`getDate` (指定范围)
- 联系方式：`getPhone`, `getEmail`
- 图片：`getImage` (使用 picsum.photos)
- 姓名：`getEnName`, `getChName` (中英文)
- 地址：`getEnAddress`
- UUID：`getUuid` (支持 crypto API)

### 📅 日期工具 (DateUtils)
- 日期格式化和解析
- 日期计算和比较

### 🌐 HTTP 工具 (HttpUtils)
- HTTP 请求辅助功能
- URL 参数处理

### 🎯 事件工具 (EventUtils)
- 事件处理辅助功能
- 事件委托

## 💡 使用示例

### 数组操作

```typescript
import { ArrayUtils } from 'ts-toolkits';

// 判空检查
ArrayUtils.isEmpty([]);                      // true
ArrayUtils.isNotEmpty([1, 2]);               // true

// 数组切片
ArrayUtils.take([1, 2, 3, 4, 5], 3);        // [1, 2, 3]
ArrayUtils.max([1, 5, 3, 2, 4]);            // 5
```

### 字符串操作

```typescript
import { StringUtils } from 'ts-toolkits';

// 空白检查和修剪
StringUtils.isBlank('  ');                   // true
StringUtils.trim('  hello  ');               // 'hello'

// 字符串转换
StringUtils.snakeCase('helloWorld');         // 'hello_world'
StringUtils.newGuid();                       // 生成 UUID
```

### 树形结构操作

```typescript
import { TreeUtils } from 'ts-toolkits';

// 初始化树形结构
const tree = TreeUtils.initTree(data, 2);    // 展开2层

// 创建测试数据（支持12种字段类型）
const testTree = TreeUtils.createTree(
  ['id', { name: 'cnName' }, { email: 'email' }, { phone: 'phone' }],
  3,  // 最大层级
  5   // 每层节点数
);

// 列表转树
const treeData = TreeUtils.handleListToTree(flatList, null, {
  keyField: 'id',
  parentKeyField: 'parentId'
});

// 节点操作
TreeUtils.updateTreeItemByIdxs(tree, [0, 1], 'name', 'New Name');
```

### 查询操作

```typescript
import { QueryUtils, Operator } from 'ts-toolkits';

// 基础查询
const result = QueryUtils.queryChunk(data, [
  { field: 'age', operator: Operator.GREATER_THAN, value: 25 }
]);

// 复杂条件组合
QueryUtils.queryChunk(data, [
  { field: 'age', operator: Operator.BETWEEN, value: [25, 35] },
  { field: 'name', operator: Operator.CONTAINS, value: 'J' }
], 'AND');
```

### 排序操作

```typescript
import { SortUtils, SortOrder } from 'ts-toolkits';

// 基础排序
SortUtils.sort(data, {
  order: SortOrder.ASC,
  sortKeys: ['age']
});

// 多字段排序
SortUtils.sort(data, {
  sortKeys: [
    { key: 'age', order: SortOrder.DESC },
    { key: 'name', order: SortOrder.ASC }
  ]
});
```

### 对象操作

```typescript
import { ObjectUtils } from 'ts-toolkits';

// 类型检查
ObjectUtils.isNullOrUndefined(null);         // true
ObjectUtils.isFunction(() => {});            // true
ObjectUtils.isPromise(Promise.resolve());    // true

// 深度属性访问
const nested = { user: { info: { name: 'John' } } };
ObjectUtils.getDescendantProperty(nested, 'user', 'info', 'name'); // 'John'
```

### 随机数据生成

```typescript
import { RandomUtils, NumberUtils } from 'ts-toolkits';

// 基础类型
RandomUtils.getInt(1, 100);                  // 随机整数
RandomUtils.getString(10);                   // 10位随机字符串

// 特定格式
RandomUtils.getUuid();                       // UUID v4
RandomUtils.getChName();                     // '张伟' - 中文名
RandomUtils.getPhone();                      // '123-456-7890'
RandomUtils.getColor();                      // '#ff5733'

// 数字字符串检查
NumberUtils.isNumeric('123');                // true - 支持数字字符串
NumberUtils.isNumeric('abc');                // false
```

## 📖 API 文档

### ArrayUtils

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| isEmpty | 检查数组是否为空 | array: T[] \| null \| undefined | boolean |
| isNotEmpty | 检查数组是否非空 | array: T[] \| null \| undefined | boolean |
| contains | 检查数组是否包含指定元素 | array: T[], item: T | boolean |
| containsAny | 检查数组是否包含任意候选元素 | array: T[], candidates: T[] | boolean |
| take | 获取数组前 N 个元素 | array: T[], n?: number | T[] |
| takeRight | 获取数组后 N 个元素 | array: T[], n?: number | T[] |
| insert | 在指定位置插入元素 | array: T[], index: number, item: T | boolean |
| remove | 移除数组中的元素 | array: T[], item: T | boolean |
| max | 查找数字数组最大值 | array: number[] | number |
| min | 查找数字数组最小值 | array: number[] | number |

### StringUtils

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| isEmpty | 检查字符串是否为空 | str: string | boolean |
| isBlank | 检查字符串是否为空白 | str: string | boolean |
| isNotEmpty | 检查字符串是否非空 | str: string | boolean |
| isNotBlank | 检查字符串是否非空白 | str: string | boolean |
| trim | 去除首尾空白 | str: string | string |
| trimToNull | 去除空白，结果为空则返回null | str: string | string \| null |
| trimToEmpty | 去除空白，null则返回空串 | str: string | string |
| equals | 字符串相等比较 | str1: string, str2: string | boolean |
| equalsIgnoreCase | 忽略大小写比较 | str1: string, str2: string | boolean |
| contains | 检查是否包含子串 | str: string, searchStr: string | boolean |
| startWith | 检查是否以指定字符串开头 | str: string, prefix: string | boolean |
| endWith | 检查是否以指定字符串结尾 | str: string, suffix: string | boolean |
| snakeCase | 转换为蛇形命名 | str: string | string |
| newGuid | 生成 GUID | - | string |
| replaceAll | 替换所有匹配文本 | str: string, search: string, replace: string | string |
| join | 连接数组元素为字符串 | array: T[], separator?: string | string |
| removeTag | 移除HTML标签，提取纯文本 | fragment: string | string |

### TreeUtils

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| initTree | 初始化树形结构 | list: T[], expandLevel?: number, hasUniKey?: boolean, childField?: keyof T | TreeItem<T>[] |
| initFlatTree | 初始化扁平化树结构 | list: T[], expandLevel?: number, hasUniKey?: boolean, childField?: keyof T | TreeItem<T>[] |
| createTree | 创建树形测试数据 | fields: FieldItem[], maxLevel?: number, num?: number | BaseTreeData<T>[] |
| expandTree | 展开树节点 | list: T[], expands: string[] \| number, expandField?: keyof T, key?: keyof T | T[] |
| handleListToTree | 列表转树形结构 | list: T[], parentKey: string \| number \| null, ops: ListToTreeOps<T> | TreeData<T>[] |
| getTreeItemByIdxs | 根据索引获取树节点 | data: T[], idxs: number[] | T \| null |
| updateTreeItemByIdxs | 更新树节点 | data: T[], idxs: number[], field: keyof T, value: any | T[] |
| updateTreeItemsByIdxs | 批量更新树节点 | data: T[], updates: UpdateOperation<T>[] | T[] |
| deleteTreeItemByIdxs | 删除树节点 | data: T[], idxs: number[] | T[] |
| deleteTreeItemsByIdxs | 批量删除树节点 | data: T[], idxsList: number[][] | T[] |

### QueryUtils

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| queryChunk | 分块条件查询 | data: T[], conditions: Condition<T>[], groupLogic?: Logic, options?: QueryChunkOps<T> | T[] |

**支持的操作符 (Operator)**:
- `EQUAL` - 等于
- `NOT_EQUAL` - 不等于
- `GREATER_THAN` - 大于
- `LESS_THAN` - 小于
- `GREATER_THAN_OR_EQUAL` - 大于等于
- `LESS_THAN_OR_EQUAL` - 小于等于
- `START_WITH` - 字符串开头匹配
- `END_WITH` - 字符串结尾匹配
- `CONTAINS` - 字符串包含
- `IN` - 在数组中
- `NOT_IN` - 不在数组中
- `BETWEEN` - 在范围内
- `BITWISE_ANY` - 位运算任意匹配
- `BITWISE_ZERO` - 位运算零值
- `BITWISE_ALL` - 位运算全部匹配
- `REGEX` - 正则表达式匹配
- `IS_NULL` - 为空
- `IS_NOT_NULL` - 非空

### SortUtils

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| sort | 归并排序 | list: T[], options?: MergeSortOps<T> | T[] |

**排序选项 (MergeSortOps)**:
- `order`: 排序方向 (SortOrder.ASC / SortOrder.DESC)
- `sortKeys`: 排序键数组
- `compare`: 自定义比较函数
- `sortChild`: 是否递归排序子元素
- `childField`: 子元素字段名

### ObjectUtils

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| isNull | 检查是否为 null | value: any | boolean |
| isUndefined | 检查是否为 undefined | value: any | boolean |
| isNullOrUndefined | 检查是否为 null 或 undefined | value: any | boolean |
| isString | 检查是否为字符串 | value: any | boolean |
| isNumber | 检查是否为有限数字（排除 NaN 和 Infinity） | value: any | boolean |
| isBoolean | 检查是否为布尔值 | value: any | boolean |
| isArray | 检查是否为数组 | value: any | boolean |
| isDate | 检查是否为日期 | value: any | boolean |
| isFunction | 检查是否为函数 | value: any | boolean |
| isPromise | 检查是否为 Promise | value: any | boolean |
| isRegExp | 检查是否为正则表达式 | value: any | boolean |
| getProperty | 获取对象属性 | obj: T, key: keyof T | any |
| setProperty | 设置对象属性 | obj: T, key: keyof T, value: T[K] | void |
| getDescendantProperty | 获取后代属性 | obj: any, ...paths: string[] | any |
| getOrDefault | 获取值或默认值 | value: T \| null \| undefined, defaultValue: T | T |
| hasValue | 检查对象是否有值 | object: T | boolean |
| toSafeString | 安全转字符串 | value: any, defaultValue?: string | string |

### NumberUtils

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| isInteger | 检查是否为整数 | value: any | boolean |
| isSafeInteger | 检查是否为安全整数 | value: any | boolean |
| isNumeric | 检查是否可转换为有效数字（含数字字符串） | value: any | boolean |
| toFixed | 数字转固定小数位字符串 | value: number \| null \| undefined, fractionDigits: number, defaultValue?: string | string |

### RandomUtils

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| getInt | 生成随机整数 | min?: number, max?: number | number |
| getFloat | 生成随机浮点数 | min?: number, max?: number, precision?: number | number |
| getBoolean | 生成随机布尔值 | - | boolean |
| getString | 生成随机字符串 | length?: number, characters?: string | string |
| getColor | 生成随机颜色 | - | string |
| getEmail | 生成随机邮箱 | domain?: string | string |
| getPhone | 生成随机电话 | - | string |
| getDate | 生成随机日期 | start?: Date, end?: Date | Date |
| getEnName | 生成英文名字 | - | string |
| getChName | 生成中文名字 | - | string |
| getEnAddress | 生成英文地址 | - | string |
| getUuid | 生成 UUID | - | string |
| uuid | getUuid（别名） | - | string |
| getImage | 生成随机图片 URL | w?: number, h?: number | string |

## ⚡ 性能建议

### QueryUtils
- 大数据量时建议设置合适的 `chunkSize`（默认 10000）
- 使用 `AND` 逻辑时会自动提前终止空结果
- 递归查询时注意树的深度

### SortUtils
- 归并排序时间复杂度 O(n log n)
- 递归排序子元素时注意性能开销
- 对于超大数据集建议分批排序

### TreeUtils
- 深层嵌套时注意递归深度
- 使用扁平化树 `initFlatTree` 提升渲染性能
- 大数据量时避免频繁的树节点更新

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！在提交 PR 之前，请确保：

1. ✅ 添加/更新测试用例
2. 📝 更新相关文档
3. 🎨 遵循现有的代码风格
4. ✨ 通过所有测试 `npm test`
5. 🔍 确保没有 ESLint 错误

### 开发流程

```bash
# 克隆项目
git clone https://github.com/TalentSmallPanda/ts-toolkits.git

# 安装依赖
pnpm install

# 运行测试
pnpm test

# 构建项目
pnpm build

# 发布版本（自动递增补丁版本号）
pnpm update
```

## 📝 更新日志

### v1.0.34 (即将发布)
- ✨ **新增功能**：
  - `NumberUtils.isNumeric()` - 支持数字字符串判断（如 "123"）
  - `ObjectUtils.isFunction()` - 函数类型检查
  - `ObjectUtils.isPromise()` - Promise 类型检查
  - `ObjectUtils.isRegExp()` - 正则表达式类型检查
  - `TreeUtils.createTree()` 新增字段类型支持：phone、color、cnName
- 🐛 **Bug 修复**：
  - 修复 `isUndefined` 方法名拼写错误（isUndefinend → isUndefined）
  - 修复 `ObjectUtils.isNumber()` 未排除 NaN 和 Infinity
  - 修复注释中的类型示例错误
- 🔥 **优化改进**：
  - 优化 `RandomUtils.getChName()` - 使用常用姓名库替代随机汉字
  - 重构 `TreeUtils.createTree()` - 提取私有方法，提升代码可读性
  - 删除无用方法：getPropertyName、values
- 📚 **文档完善**：
  - 大幅完善 README 文档
  - 补充完整的 API 文档和使用示例
  - 添加性能建议章节

### v1.0.33
- 🐛 Bug 修复和性能优化
- 📚 文档完善

### v1.0.26
- ✨ 新增功能：`SortUtils` 排序工具模块
- 🚀 核心功能：
  - 支持多字段/多级排序（嵌套属性路径）
  - 支持递归排序子元素（如树形结构）
  - 提供 `compare` 和 `transform` 灵活处理复杂场景
  - 内置归并排序算法保证稳定性
- 🔗 兼容性：与现有 `QueryUtils` 的条件查询无缝衔接

### v1.0.25
- ✨ 新增功能：`QueryUtils` 查询工具模块
- 🎯 新增操作符：支持 BITWISE、REGEX、IS_NULL/IS_NOT_NULL 等 18 种条件判断
- 🚀 新增特性：分块查询、递归子项处理、条件组合（AND/OR）

### v1.0.0
- 🎉 初始版本发布
- ✅ 实现基础数组工具函数
- 🌳 实现树形结构工具函数
- 🔢 实现数字工具函数

## 📄 许可证

ISC License

## 🙏 致谢

感谢所有贡献者的支持！

## 📮 联系方式

- **Issues**: [GitHub Issues](https://github.com/TalentSmallPanda/ts-toolkits/issues)
- **NPM**: [ts-toolkits](https://www.npmjs.com/package/ts-toolkits)

## 🔗 相关链接

- [更新日志](https://github.com/TalentSmallPanda/ts-toolkits/releases)
- [在线文档](https://TalentSmallPanda.github.io/ts-toolkits) (计划中)

---

**如果这个项目对您有帮助，请给它一个 ⭐️ Star！**
