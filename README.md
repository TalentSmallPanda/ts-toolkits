# ts-toolkits

一个实用的 TypeScript 工具库，提供了丰富的数组、树形结构和数字处理工具函数。

## 安装

```bash
npm install ts-toolkits
```

## 功能特性

### 🔸 数组工具 (ArrayUtils)
- 数组判空检查
- 数组元素查找
- 数组元素插入/删除
- 数组切片操作
- 数值数组最大/最小值查找

### 🔸 树形结构工具 (TreeUtils)
- 树形数据初始化
- 树形数据创建
- 展开/收起节点控制
- 列表转树形结构
- 树节点查找/更新/删除

### 🔸 数字工具 (NumberUtils)
- 数字类型检查
- 数值范围处理
- 安全整数验证

### 🔍 查询工具 (QueryUtils)
  - 复杂数据查询：支持条件组合、分块处理、递归子项查询
  - 操作符支持：AND/OR 逻辑、BETWEEN、位运算、正则表达式、空值判断等
  - 分块处理：支持大数据量分批次查询
  - 递归查询：自动处理嵌套子项（如树形结构）


## 使用示例

### 数组操作

## API 文档

### ArrayUtils

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| isEmpty | 检查数组是否为空 | array: T[] | boolean |
| isNotEmpty | 检查数组是否非空 | array: T[] | boolean |
| contains | 检查数组是否包含指定元素 | array: T[], item: T | boolean |
| take | 获取数组前 N 个元素 | array: T[], n?: number | T[] |
| takeRight | 获取数组后 N 个元素 | array: T[], n?: number | T[] |

### TreeUtils

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| initTree | 初始化树形结构 | list: T[], expandLevel?: number | TreeItem<T>[] |
| handleListToTree | 列表转树形结构 | list: T[], parentKey: string, ops: ListToTreeOps<T> | TreeData<T>[] |
| updateTreeItemByIdxs | 更新树节点 | data: T[], idxs: number[], field: keyof T, value: any | T[] |
| deleteTreeItemByIdxs | 删除树节点 | data: T[], idxs: number[] | T[] |

## 类型定义

## 贡献指南

欢迎提交 Issue 和 Pull Request。在提交 PR 之前，请确保：

1. 添加/更新测试用例
2. 更新相关文档
3. 遵循现有的代码风格

## 更新日志

### v1.0.24
 - 新增功能：QueryUtils 查询工具模块
 - 新增操作符：支持 BITWISE、REGEX、IS_NULL/IS_NOT_NULL 等 18 种条件判断
 - 新增特性：分块查询、递归子项处理、条件组合（AND/OR）

### v1.0.0
- 初始版本发布
- 实现基础数组工具函数
- 实现树形结构工具函数
- 实现数字工具函数
