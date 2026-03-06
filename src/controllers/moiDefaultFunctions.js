const Model = require("../models/moiDefaultFunctions");
const TransactionFunctionModel = require("../models/transactionFunctions");
const User = require("../models/user");

exports.controller = {
  // Return all global default functions
  list: async (req, res) => {
    try {
      const functions = await Model.readAll();

      if (!functions || functions.length === 0) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "வழு வகைகள் எதுவும் கிடைக்கவில்லை." },
        });
      }

      const transformed = functions.map((f) => ({ id: f.id, name: f.name }));

      return res.status(200).json({
        responseType: "S",
        count: transformed.length,
        responseValue: transformed,
      });
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const func = await Model.readById(id);

      if (!func) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "குறிப்பிடப்பட்ட விழா வகை இல்லை!" },
        });
      }

      return res.status(200).json({
        responseType: "S",
        responseValue: {
          id: func.id,
          name: func.name,
        },
      });
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  create: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name)
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "name is required" },
        });

      const result = await Model.create(name);
      return res.status(201).json({
        responseType: "S",
        responseValue: {
          message: "Default function created.",
          id: result.insertId,
        },
      });
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id, name } = req.body;
      if (!id || !name) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "தவறான தரவுகள்." },
        });
      }
      const existing = await Model.readById(id);
      if (!existing) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "Default function not found." },
        });
      }
      const success = await Model.update(id, name);
      if (success) {
        return res.status(200).json({
          responseType: "S",
          responseValue: { message: "Updated successfully." },
        });
      } else {
        return res.status(500).json({
          responseType: "F",
          responseValue: { message: "Update failed." },
        });
      }
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "ID required." },
        });
      }
      const existing = await Model.readById(id);
      if (!existing) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "Default function not found." },
        });
      }
      const success = await Model.delete(id);
      if (success) {
        return res.status(200).json({
          responseType: "S",
          responseValue: { message: "Deleted successfully." },
        });
      } else {
        return res.status(500).json({
          responseType: "F",
          responseValue: { message: "Delete failed." },
        });
      }
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  // Dropdown API: returns global defaults + user's transaction functions
  dropdown: async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "userId is required" },
        });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "User not found" },
        });
      }

      const defaultFunctions = await Model.readAll();
      const txFunctions = await TransactionFunctionModel.readAll(userId, {
        limit: 500,
        offset: 0,
      });

      const defaultList = defaultFunctions.map((f) => ({
        id: f.id,
        name: f.name,
        date: null,
      }));
      const txList = txFunctions.map((f) => ({
        id: f.id,
        name: f.functionName,
        date: f.functionDate,
      }));

      const combinedList = [...defaultList, ...txList];
      // sort alphabetically by name
      combinedList.sort((a, b) => a.name.localeCompare(b.name));

      return res.status(200).json({
        responseType: "S",
        responseValue: combinedList,
      });
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },
};
