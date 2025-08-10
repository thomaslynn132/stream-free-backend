// import {
//   find,
//   findById,
//   create,
//   findByIdAndUpdate,
//   findByIdAndDelete,
// } from "../model/supportModel.js";
import Supports from "../model/supportModel.js";

//! Get all support tickets
export async function getAllSupportTickets(req, res) {
  try {
    const supports = await Supports.find();

    res.status(200).json({
      status: 200,
      message: "fetch data successfully",
      results: supports.length,
      supports,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  }
}

//! Get a single support ticket by ID
export async function getSupportTicketById(req, res) {
  try {
    const support = await Supports.findById(req.params.id);
    if (!support) {
      return res.status(404).json({
        status: 404,
        message: "Support ticket not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "fetch data successfully",
      support,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  }
}

//! Create a new support ticket
export async function createSupportTicket(req, res) {
  try {
    const support = await Supports.create(req.body);

    res
      .status(201)
      .send({ message: "Support ticket created successfully", support });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  }
}

//! Update a support ticket
export async function updateSupportTicket(req, res) {
  try {
    const support = await Supports.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!support) {
      return res.status(404).json({
        status: 404,
        message: "Support ticket not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Support ticket updated successfully",
      support,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  }
}

//! Delete a support ticket
export async function deleteSupportTicket(req, res) {
  try {
    const support = await Supports.findByIdAndDelete(req.params.id);
    if (!support) {
      return res.status(404).json({
        status: 404,
        message: "Support ticket not found",
      });
    }
    res.status(200).json({
      status: 204,
      message: "Support ticket deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err,
    });
  }
}
