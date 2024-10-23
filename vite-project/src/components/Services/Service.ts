
import axios from "axios";
import { Task } from "./TaskObject";
import { handleError } from "../Services/ErrorHandler";

const API = 'https://localhost:443/taskManager/';


export const getTasks = async (idUser: string): Promise<Task[]> => {
    try {
        const token = sessionStorage.getItem("token"); 
        const response = await fetch(API + "getTasksByUser?userId=" + idUser, {     
            method: 'GET', 
            headers: {       
                'Content-Type': 'application/json',       
                'Authorization': `Bearer ${token}`    
            }, 
            mode: 'cors', 
            cache: 'default'
        });

        const data = await response.json();
        return data; 
    } catch (error) {
        handleError(error);
    }
};



export const saveNewTask = async (idUser: string, newTask: Task) => {
    try {
        const token = sessionStorage.getItem("token"); 
        await fetch(API + "saveTaskByUser?userId=" + idUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`    
            },
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(newTask) 
        });
    } catch (error) {
        handleError(error);
    }
};


export const deleteTask = async (idTask: string) => {
    try {
        const token = sessionStorage.getItem("token"); 
        await fetch(API+'delete?id='+idTask, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`    
            },
            mode: 'cors',
            cache: 'default'
        });
    } catch (error) {
        handleError(error);
    }
}

export const completeTask = async (idTask: string) => {
    try {
        const token = sessionStorage.getItem("token"); 
        await fetch(API+'markTaskAsCompleted?id='+idTask, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`    
            },
            mode: 'cors',
            cache: 'default'
        });
    } catch (error) {
        handleError(error);
    }
}

export const randomTasks = async (idUser: string) => {
    try {
        const token = sessionStorage.getItem("token"); 
        await fetch(API+'generateTasks?idUser='+idUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`    
            },
            mode: 'cors',
            cache: 'default'
        });
    } catch (error) {
        handleError(error);
    }
}

export const getUser = async (id: string) => {
    return axios.get<string>(API+'getUser?idUser='+id,{
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    });
}


