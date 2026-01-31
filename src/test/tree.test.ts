import { IsLast, IsVisible, TreeLevel } from "../utils/enum";
import TreeUtils from "../utils/tree.utils";
import { ListToTreeOps, UpdateOperation } from "../utils/type";

describe("TreeUtils", () => {
  describe("initTree", () => {
    it("应该正确初始化树结构", () => {
      const data = [
        { id: 1, children: [{ id: 11 }, { id: 12 }] },
        { id: 2, children: [{ id: 21 }] },
      ];

      const result = TreeUtils.initTree(data, 2, true);

      expect(result.length).toBe(2);
      expect(result[0]._level).toBe(TreeLevel.One);
      expect(result[0]._expanded).toBe(true);
      expect(result[0].children.length).toBe(2);
      expect(result[0].children[0]._level).toBe(TreeLevel.Two);
      expect(result[0].children[0]._expanded).toBe(true);
      expect(result[0].children[0]._uniKey).toBe("0-0");
      expect(result[1]._level).toBe(TreeLevel.One);
      expect(result[1]._expanded).toBe(true);
      expect(result[1].children.length).toBe(1);
      expect(result[1].children[0]._level).toBe(TreeLevel.Two);
      expect(result[1].children[0]._expanded).toBe(true);
      expect(result[1].children[0]._uniKey).toBe("1-0");
      expect(result[1].children[0]._visible).toBe(IsVisible.Y);

      //检查lastArray
      expect(result[0]._lastArray).toEqual([IsLast.F]);
      expect(result[1]._lastArray).toEqual([IsLast.T]);
      expect(result[0].children[0]._lastArray).toEqual([IsLast.F, IsLast.F]);
      expect(result[0].children[1]._lastArray).toEqual([IsLast.F, IsLast.T]);
      expect(result[1].children[0]._lastArray).toEqual([IsLast.T, IsLast.T]);

      //检查idxs
      expect(result[0]._idxs).toEqual([0]);
      expect(result[1]._idxs).toEqual([1]);
      expect(result[0].children[0]._idxs).toEqual([0, 0]);
      expect(result[0].children[1]._idxs).toEqual([0, 1]);
      expect(result[1].children[0]._idxs).toEqual([1, 0]);
    });

    it("应该正确处理空数据", () => {
      const result = TreeUtils.initTree([]);
      expect(result).toEqual([]);
    });

    it("应该正确处理没有子节点的数据", () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = TreeUtils.initTree(data);
      expect(result.length).toBe(2);
      expect(result[0].children).toEqual([]);
      expect(result[1].children).toEqual([]);
    });
  });

  describe("initFlatTree", () => {
    it("应该正确初始化扁平树结构", () => {
      const data = [
        { id: 1, children: [{ id: 11 }, { id: 12 }] },
        { id: 2, children: [{ id: 21 }] },
      ];

      const result = TreeUtils.initFlatTree(data, 1, true);

      expect(result.length).toBe(5);
      expect(result[0].id).toBe(1);
      expect(result[0]._level).toBe(TreeLevel.One);
      expect(result[0]._expanded).toBe(true);

      expect(result[1].id).toBe(11);
      expect(result[1]._level).toBe(TreeLevel.Two);
      expect(result[1]._expanded).toBe(true);
      expect(result[1]._visible).toBe(IsVisible.Y);

      expect(result[2].id).toBe(12);
      expect(result[2]._level).toBe(TreeLevel.Two);
      expect(result[2]._expanded).toBe(true);

      expect(result[3].id).toBe(2);
      expect(result[3]._level).toBe(TreeLevel.One);
      expect(result[3]._expanded).toBe(true);

      // 检查 _uniKey
      expect(result[0]._uniKey).toBe("0");
      expect(result[1]._uniKey).toBe("0-0");
      expect(result[2]._uniKey).toBe("0-1");
      expect(result[3]._uniKey).toBe("1");

      // 检查 _lastArray
      expect(result[0]._lastArray).toEqual([IsLast.F]);
      expect(result[1]._lastArray).toEqual([IsLast.F, IsLast.F]);
      expect(result[2]._lastArray).toEqual([IsLast.F, IsLast.T]);
      expect(result[3]._lastArray).toEqual([IsLast.T]);

      // 检查 _idxs
      expect(result[0]._idxs).toEqual([0]);
      expect(result[1]._idxs).toEqual([0, 0]);
      expect(result[2]._idxs).toEqual([0, 1]);
      expect(result[3]._idxs).toEqual([1]);
    });

    it("应该正确处理空数据", () => {
      const result = TreeUtils.initFlatTree([]);
      expect(result).toEqual([]);
    });

    it("应该正确处理带有expandLevel的数据", () => {
      const data = [
        { id: 1, children: [{ id: 11 }, { id: 12 }] },
        { id: 2, children: [{ id: 21 }] },
      ];

      const result = TreeUtils.initFlatTree(data);
      expect(result.length).toBe(5);
      expect(result[0]._visible).toBe(IsVisible.Y);
      expect(result[1]._visible).toBe(IsVisible.N);
      expect(result[3]._visible).toBe(IsVisible.Y);
      expect(result[4]._visible).toBe(IsVisible.N);
    });

    it("应该正确处理展开标志的数据", () => {
      const data = [
        { id: 1, children: [{ id: 11 }, { id: 12 }] },
        { id: 2, children: [{ id: 21 }] },
      ];

      const result = TreeUtils.initFlatTree(data, 0);
      expect(result.length).toBe(5);
      expect(result[0]._expanded).toBe(true);
      expect(result[0]._visible).toBe(IsVisible.Y);
      expect(result[1]._expanded).toBe(false);
      expect(result[1]._visible).toBe(IsVisible.Y);
      expect(result[3]._expanded).toBe(true);
      expect(result[3]._visible).toBe(IsVisible.Y);
    });

    it("应该正确处理没有子节点的数据", () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = TreeUtils.initFlatTree(data);
      expect(result.length).toBe(2);
      expect(result[0].children).toBeUndefined();
      expect(result[1].children).toBeUndefined();
    });
  });

  describe("createTree", () => {
    it("应该正确创建树结构", () => {
      const result = TreeUtils.createTree(["id"], 2, 2);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe("id_0");
      expect(result[0].children.length).toBe(2);
      expect(result[0].children[0].id).toBe("id_0_0");
      expect(result[1].id).toBe("id_1");
      expect(result[1].children.length).toBe(2);
      expect(result[1].children[0].id).toBe("id_1_0");
    });

    it("应该正确处理最大层级", () => {
      const result = TreeUtils.createTree(["id"], 1, 2);
      expect(result.length).toBe(2);
      expect(result[0].children[0].id).toBe("id_0_0");
      expect(result[1].children[0].id).toBe("id_1_0");
    });

    it("应该正确处理空字段", () => {
      const result = TreeUtils.createTree(
        [
          "id",
          { enName: "enName" },
          { chName: "chName" },
          { address: "address" },
          { img: "img" },
          { uuid: "uuid" },
          { email: "email" },
          { count: 1 },
          { price: 1.11 },
          { idShow: true },
        ],
        2,
        2
      );
      expect(result.length).toBe(2);
      expect(result[0].children.length).toBe(2);
      expect(result[0].children[0].children.length).toBe(2);
    });
  });

  describe("expandTree", () => {
    const baseData = [
      {
        id: "1",
        _expanded: false,
        children: [
          { id: "11", _expanded: false },
          { id: "12", _expanded: false },
        ],
      },
      { id: "2", _expanded: false, children: [{ id: "21", _expanded: false }] },
    ];
    it("应该针对特定ID正确展开树", () => {
      const data = TreeUtils.initTree(baseData);
      const expands = ["1"];
      const result = TreeUtils.expandTree(data, expands, undefined, "id");
      expect(result[0]._expanded).toBe(true);
      expect(result[0].children[0]._expanded).toBe(false);
      expect(result[1]._expanded).toBe(false);
    });
    it("应该正确处理空的展开数组", () => {
      const data = TreeUtils.initTree(baseData);
      const expands: string[] = [];
      const result = TreeUtils.expandTree(data, expands, "id");
      expect(result[0]._expanded).toBe(false);
      expect(result[0].children[0]._expanded).toBe(false);
      expect(result[1]._expanded).toBe(false);
    });

    it("当expands是数字时应该根据深度展开树", () => {
      const data = TreeUtils.initTree(baseData);
      const expands = 1; // 仅展开第一级
      const result = TreeUtils.expandTree(data, expands);
      expect(result[0]._expanded).toBe(true);
      expect(result[0].children[0]._expanded).toBe(true);
      expect(result[1]._expanded).toBe(true);
    });

    it("如果给定深度为0则不应展开任何项", () => {
      const data = TreeUtils.initTree(baseData);
      const expands = 0;
      const result = TreeUtils.expandTree(data, expands);
      expect(result[0]._expanded).toBe(true);
      expect(result[0].children[0]._expanded).toBe(false);
      expect(result[1]._expanded).toBe(false);
      expect(result[3]._expanded).toBe(true);
    });
  });

  describe("handleListToTree", () => {
    it("应该正确将列表转换为树", () => {
      const list = [
        { id: "01", name: "张大大", pid: "", job: "项目经理" },
        { id: "02", name: "小亮", pid: "01", job: "产品leader" },
        { id: "03", name: "小美", pid: "01", job: "UIleader" },
        { id: "04", name: "老马", pid: "01", job: "技术leader" },
        { id: "05", name: "老王", pid: "01", job: "测试leader" },
        { id: "06", name: "老李", pid: "01", job: "运维leader" },
        { id: "07", name: "小丽", pid: "02", job: "产品经理" },
        { id: "08", name: "大光", pid: "02", job: "产品经理" },
        { id: "09", name: "小高", pid: "03", job: "UI设计师" },
        { id: "10", name: "小刘", pid: "04", job: "前端工程师" },
        { id: "11", name: "小华", pid: "04", job: "后端工程师" },
        { id: "12", name: "小李", pid: "04", job: "后端工程师" },
        { id: "13", name: "小赵", pid: "05", job: "测试工程师" },
        { id: "14", name: "小强", pid: "05", job: "测试工程师" },
        { id: "15", name: "小涛", pid: "06", job: "运维工程师" },
        { id: "16", name: "4-10-1", pid: "10", job: "运维工程师" },
        { id: "18", name: "4-10-2", pid: "10", job: "运维工程师" },
        { id: "19", name: "4-10-4", pid: "10", job: "运维工程师" },
        { id: "022", name: "张小亮", pid: "", job: "产品leader" },
        { id: "023", name: "4-10-4", pid: "022", job: "运维工程师" },
      ];
      const ops: ListToTreeOps<{ id: string; pid: string }> = {
        keyField: "id",
        parentKeyField: "pid",
      };
      const result = TreeUtils.handleListToTree(list, "", ops);
      console.log(JSON.stringify(result));
      expect(result.length).toBe(2);
      expect(result[0].id).toBe("01");
      expect(result[0].children.length).toBe(5);
    });
    it("应该正确处理最大层级", () => {
      const list = [
        { id: "01", name: "张大大", pid: "", job: "项目经理" },
        { id: "02", name: "小亮", pid: "01", job: "产品leader" },
        { id: "03", name: "小美", pid: "01", job: "UIleader" },
        { id: "04", name: "老马", pid: "01", job: "技术leader" },
        { id: "05", name: "老王", pid: "01", job: "测试leader" },
        { id: "06", name: "老李", pid: "01", job: "运维leader" },
        { id: "07", name: "小丽", pid: "02", job: "产品经理" },
        { id: "08", name: "大光", pid: "02", job: "产品经理" },
        { id: "09", name: "小高", pid: "03", job: "UI设计师" },
        { id: "10", name: "小刘", pid: "04", job: "前端工程师" },
        { id: "11", name: "小华", pid: "04", job: "后端工程师" },
        { id: "12", name: "小李", pid: "04", job: "后端工程师" },
        { id: "13", name: "小赵", pid: "05", job: "测试工程师" },
        { id: "14", name: "小强", pid: "05", job: "测试工程师" },
        { id: "15", name: "小涛", pid: "06", job: "运维工程师" },
        { id: "16", name: "4-10-1", pid: "10", job: "运维工程师" },
        { id: "18", name: "4-10-2", pid: "10", job: "运维工程师" },
        { id: "19", name: "4-10-4", pid: "10", job: "运维工程师" },
        { id: "022", name: "张小亮", pid: "", job: "产品leader" },
        { id: "023", name: "4-10-4", pid: "022", job: "运维工程师" },
      ];
      const ops: ListToTreeOps<{ id: string; pid: string }> = {
        keyField: "id",
        parentKeyField: "pid",
        maxLevel: 0,
      };
      const result = TreeUtils.handleListToTree(list, "", ops);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe("01");
      expect(result[0].children?.length).toBe(0);
    });
    it("应该处理maxLevel < 0的情况", () => {
      const list = [{ id: "01", name: "张大大", pid: "", job: "项目经理" }];
      const ops: ListToTreeOps<{ id: string; pid: string }> = {
        keyField: "id",
        parentKeyField: "pid",
        maxLevel: -1,
      };
      const result = TreeUtils.handleListToTree(list, "", ops);
      expect(result.length).toBe(0);
    });
  });

  describe("getTreeItemByIdxs", () => {
    it("应该通过idxs正确获取树项", () => {
      const data = [
        { id: 1, children: [{ id: 11, children: [{ id: 111 }] }, { id: 12 }] },
        { id: 2, children: [{ id: 21 }] },
      ];
      const item = TreeUtils.getTreeItemByIdxs(data, [0, 0, 0]);
      expect(item?.id).toBe(111);
      const item2 = TreeUtils.getTreeItemByIdxs(data, [1, 0]);
      expect(item2?.id).toBe(21);
      const item3 = TreeUtils.getTreeItemByIdxs(data, [0, 1]);
      expect(item3?.id).toBe(12);
      const item4 = TreeUtils.getTreeItemByIdxs(data, [2, 0]);
      expect(item4?.id).toBe(21);
    });
  });

  describe("updateTreeItemByIdxs", () => {
    it("应该通过idxs正确更新树项", () => {
      const data = [
        { id: 1, children: [{ id: 11 }, { id: 12 }] },
        { id: 2, children: [{ id: 21 }] },
      ];
      const updatedData = TreeUtils.updateTreeItemByIdxs(TreeUtils.initTree(data), [0, 0], "id", 111);
      expect(updatedData[0].children[0].id).toBe(111);
      expect(updatedData).not.toBe(data); // 确保返回新数组
    });
  });

  describe("updateTreeItemsByIdxs", () => {
    it("应该正确更新多个树项", () => {
      const data = [
        { id: 1, children: [{ id: 11 }, { id: 12 }] },
        { id: 2, children: [{ id: 21 }] },
      ];
      const updates: UpdateOperation<(typeof data)[number]>[] = [
        { idxs: [0, 0], field: "id", value: 111 },
        { idxs: [1, 0], field: "id", value: 222 },
      ];
      const updatedData = TreeUtils.updateTreeItemsByIdxs(TreeUtils.initTree(data), updates);
      expect(updatedData[0].children[0].id).toBe(111);
      expect(updatedData[1].children[0].id).toBe(222);
      expect(updatedData).not.toBe(data);
    });
  });

  describe("deleteTreeItemByIdxs", () => {
    it("应该通过idxs正确删除树项", () => {
      const data = [
        { id: 1, children: [{ id: 11 }, { id: 12 }] },
        { id: 2, children: [{ id: 21 }] },
      ];
      const updatedData = TreeUtils.deleteTreeItemByIdxs(TreeUtils.initTree(data), [0, 0]);
      expect(updatedData[0].children.length).toBe(1);
      expect(updatedData[0].children[0].id).toBe(12);
      expect(updatedData).not.toBe(data);
    });
  });

  describe("deleteTreeItemsByIdxs", () => {
    it("应该正确删除多个树项", () => {
      const data = [
        { id: 1, children: [{ id: 11 }, { id: 12 }] },
        { id: 2, children: [{ id: 21 }] },
      ];
      const idxsList = [
        [0, 0],
        [1, 0],
      ];
      const updatedData = TreeUtils.deleteTreeItemsByIdxs(TreeUtils.initTree(data), idxsList);
      expect(updatedData[0].children.length).toBe(1);
      expect(updatedData[1].children.length).toBe(0);
      expect(updatedData).not.toBe(data);
    });
  });
});
