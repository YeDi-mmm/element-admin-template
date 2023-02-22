export default [
  {
    url: '/api/menus',
    method: 'get',
    timeout: 100,
    response: ({ query }) => {
      // 响应内容
      const childs = [
        101,
        1000,
        1001,
        1002,
        1003,
        1004,
        1005,
        1006,
        1007,
        1008,
      ]

      return {
        code: 200,
        message: '获取菜单成功',
        roles: childs,
      }
    },
  },
]
