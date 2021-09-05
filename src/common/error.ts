export const graphqlErrorMap = {
  400000: '参数错误',
  500000: '服务器内部错误',
  // 详细错误
  400100: '域名已存在',
  400101: '不能删除已与分发实例绑定的域名',
  400200: '修改实例时，不能移除已绑定的域名',
  400201: '绑定的域名必须配置有 CNAME',
  400202: '绑定的域名中存在相同的 CNAME',
  400203: '绑定的域名中存在相同的厂商',
  400211: '用户来源匹配规则重复',
  400220: '暂无数据',
};

export const errorCodeMap = {
  0: '当前网络不稳定',
  401: '用户信息不能通过验证，尝试重新登陆',
  500: '服务器出小差了，请稍后再试',
};

// https://github.com/grpc/grpc/blob/master/doc/statuscodes.md
export const grapCommonErrorMap = {
  2: graphqlErrorMap[500000],
  3: graphqlErrorMap[400000],
  4: graphqlErrorMap[500000],
  5: graphqlErrorMap[500000],
  6: graphqlErrorMap[500000],
  7: '无权限操作',
  8: graphqlErrorMap[500000],
  9: graphqlErrorMap[500000],
  10: graphqlErrorMap[500000],
  11: graphqlErrorMap[500000],
  12: graphqlErrorMap[500000],
  13: graphqlErrorMap[500000],
  14: graphqlErrorMap[500000],
  16: errorCodeMap[401],
};
