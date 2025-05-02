export enum IsLast {
  T = 1,
  F = 0,
}

export enum IsVisible {
  Y = "Y",
  N = "N",
}

export enum TreeLevel {
  One = 0,
  Two,
  Three,
  Four,
  Five,
  Six,
}

export enum Operator {
  // 基础比较
  LESS_THAN, // 小于
  LESS_THAN_OR_EQUAL, // 小于等于
  EQUAL, // 等于
  NOT_EQUAL, // 不等于
  GREATER_THAN_OR_EQUAL, // 大于等于
  GREATER_THAN, // 大于
  // 字符串匹配
  START_WITH, // 以某值开头
  END_WITH, // 以某值结尾
  CONTAINS, // 包含某值
  // 集合判断
  IN, // 在集合内
  NOT_IN, // 不在集合内
  // 范围判断
  BETWEEN, // 在区间内 [min, max]
  // 位运算
  BITWISE_ANY, // 位与结果>0（存在共同位）
  BITWISE_ZERO, // 位与结果=0（无共同位）
  BITWISE_ALL, // 位与结果=目标值（所有位匹配）
  // 正则匹配
  REGEX, // 正则表达式匹配
  // 空值判断
  IS_NULL, // 是 null/undefined
  IS_NOT_NULL, // 非 null/undefined
}

export enum SortOrder {
  ASC = "ASC", // 正序 (ascending)
  DESC = "DESC", // 倒序 (descending)
}

export enum ChildQueryMode {
  PARENT_ONLY = "PARENT_ONLY", // 仅检查父项
  PARENT_AND_CHILD = "PARENT_AND_CHILD", // 父项满足后查询子项
  CHILD_ONLY = "CHILD_ONLY", // 仅检查子项，子项匹配则返回父项
}
