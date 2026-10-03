"use server";
import {transitionWorkOrder,type WorkOrderActionState} from "../actions";
export async function updateWorkOrderStatus(prev:WorkOrderActionState,fd:FormData){return transitionWorkOrder(prev,fd);}
