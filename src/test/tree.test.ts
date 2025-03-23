import { IsLast, TreeLevel } from "../utils/enum";
import TreeUtils from "../utils/tree.utils";
import { ListToTreeOps, UpdateOperation } from "../utils/type";

describe("TreeUtils", () => {
  describe("initTree", () => {
    it("should initialize a tree structure correctly", () => {
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

      //Check lastArray
      expect(result[0]._lastArray).toEqual([IsLast.F]);
      expect(result[1]._lastArray).toEqual([IsLast.T]);
      expect(result[0].children[0]._lastArray).toEqual([IsLast.F, IsLast.F]);
      expect(result[0].children[1]._lastArray).toEqual([IsLast.F, IsLast.T]);
      expect(result[1].children[0]._lastArray).toEqual([IsLast.T, IsLast.T]);

      //Check idxs
      expect(result[0]._idxs).toEqual([0]);
      expect(result[1]._idxs).toEqual([1]);
      expect(result[0].children[0]._idxs).toEqual([0, 0]);
      expect(result[0].children[1]._idxs).toEqual([0, 1]);
      expect(result[1].children[0]._idxs).toEqual([1, 0]);
    });

    it("should handle empty data correctly", () => {
      const result = TreeUtils.initTree([]);
      expect(result).toEqual([]);
    });

    it("should handle data with no children correctly", () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = TreeUtils.initTree(data);
      expect(result.length).toBe(2);
      expect(result[0].children).toEqual([]);
      expect(result[1].children).toEqual([]);
    });
  });

  describe("createTree", () => {
    it("should create a tree structure correctly", () => {
      const result = TreeUtils.createTree(["id"], 2, 2);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe("id_0");
      expect(result[0].children.length).toBe(2);
      expect(result[0].children[0].id).toBe("id_0_0");
      expect(result[1].id).toBe("id_1");
      expect(result[1].children.length).toBe(2);
      expect(result[1].children[0].id).toBe("id_1_0");
    });

    it("should handle maxLevel correctly", () => {
      const result = TreeUtils.createTree(["id"], 1, 2);
      expect(result.length).toBe(2);
      expect(result[0].children[0].id).toBe("id_0_0");
      expect(result[1].children[0].id).toBe("id_1_0");
    });

    it("should handle empty fields correctly", () => {
      const result = TreeUtils.createTree([], 2, 2);
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
    it("should expand the tree correctly for specific ids", () => {
      const data = TreeUtils.initTree(baseData);
      const expands = ["1"];
      const result = TreeUtils.expandTree(data, expands, undefined, "id");
      expect(result[0]._expanded).toBe(true);
      expect(result[0].children[0]._expanded).toBe(false);
      expect(result[1]._expanded).toBe(false);
    });
    it("should handle empty expands array correctly", () => {
      const data = TreeUtils.initTree(baseData);
      const expands: string[] = [];
      const result = TreeUtils.expandTree(data, expands, "id");
      expect(result[0]._expanded).toBe(false);
      expect(result[0].children[0]._expanded).toBe(false);
      expect(result[1]._expanded).toBe(false);
    });

    it("should expand tree based on depth when expands is a number", () => {
      const data = TreeUtils.initTree(baseData);
      const expands = 1; // Expand first level only
      const result = TreeUtils.expandTree(data, expands);
      expect(result[0]._expanded).toBe(true);
      expect(result[0].children[0]._expanded).toBe(true);
      expect(result[1]._expanded).toBe(true);
    });

    it("should not expand any items if given depth is 0", () => {
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
    it("should convert a list to a tree correctly", () => {
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
      ];
      const ops: ListToTreeOps<{ id: string; pid: string }> = {
        keyField: "id",
        parentKeyField: "pid",
      };
      const result = TreeUtils.handleListToTree(list, "", ops);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe("01");
      expect(result[0].children.length).toBe(5);
    });
    it("should handle maxLevel correctly", () => {
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
      ];
      const ops: ListToTreeOps<{ id: string; pid: string }> = {
        keyField: "id",
        parentKeyField: "pid",
        maxLevel: 0,
      };
      const result = TreeUtils.handleListToTree(list, "", ops);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe("01");
      expect(result[0].children?.length).toBe(0);
    });
    it("should handle maxLevel < 0", () => {
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
    it("should get a tree item by its idxs correctly", () => {
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
    it("should update a tree item by its idxs correctly", () => {
      const data = [
        { id: 1, children: [{ id: 11 }, { id: 12 }] },
        { id: 2, children: [{ id: 21 }] },
      ];
      const updatedData = TreeUtils.updateTreeItemByIdxs(TreeUtils.initTree(data), [0, 0], "id", 111);
      expect(updatedData[0].children[0].id).toBe(111);
      expect(updatedData).not.toBe(data); // Ensure a new array is returned
    });
  });

  describe("updateTreeItemsByIdxs", () => {
    it("should update multiple tree items correctly", () => {
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
    it("should delete a tree item by its idxs correctly", () => {
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
    it("should delete multiple tree items correctly", () => {
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
