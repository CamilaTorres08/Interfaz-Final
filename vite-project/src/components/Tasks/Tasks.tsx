import React, { useEffect, useState } from 'react';
import styles from './Task.module.css'
import Load from './Load';
import * as serviceTasks from '../Services/Service';
import { Task } from "../Services/TaskObject";


export default function Tasks() {

    const [post, setPost] = useState<Task[]>([]);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDate, setTaskDate] = useState('');
    const [taskDifficulty, setTaskDifficulty] = useState('');
    const [taskPriority, setTaskPriority] = useState(1);
    const [taskTime, setTaskTime] = useState(0.1);
    const [enableButton, setEnableButton] = useState(false);
    const [idUser, setIdUser] = useState<string | null>(null);
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskName(e.target.value);
    }
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTaskDescription(e.target.value);
    }
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskDate(e.target.value);
    }
    const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskDifficulty(e.target.id);
    }
    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTaskPriority(parseInt(e.target.value));
    }
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskTime(parseFloat(e.target.value));
    }

    useEffect(() => {
        const id = sessionStorage.getItem("user");
        if (id) {
          setIdUser(id);
          getTasks(); 
        }
      }, [idUser]);

      const getTasks = async () => {
        if(idUser){
            const answer = await serviceTasks.getTasks(idUser);
            if (answer) {
                setPost(answer);
            }
        }
      };
    
    const addTask = async () => {   
        if (!taskName || !taskDescription || !taskDate || !taskDifficulty || !taskPriority || !taskTime) {
            alert('Please fill all the fields');
            return;
        }  
        if(taskName.length > 30){
            alert('The title is too long');
            return;
        }
        if (taskDescription.length > 50) {
            alert('The description is too long');
            return;
        }
        if (taskTime < 0){
            alert('You cannot add negative time');
            return;
       }    
       let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        let selectedDate = new Date(taskDate);
        selectedDate.setHours(0, 0, 0, 0);
        console.log(currentDate);
        console.log(selectedDate);
        if (selectedDate < currentDate) {
            alert('The due date must be greater than the current date');
            return;
        }; 
        const updatedTask: Task = {
            name: taskName,
            description: taskDescription,
            dueDate: taskDate,
            difficulty: taskDifficulty,
            priority: taskPriority,
            estimatedTime: taskTime
          };
        if(idUser) {
            await serviceTasks.saveNewTask(idUser, updatedTask);
            getTasks();
        }
        
        setTaskName('');
        setTaskDescription('');
        setTaskDate('');
        setTaskDifficulty('');
        setTaskPriority(1);
        setTaskTime(0.1);
        
    }

    const deleteTask = async (taskId: string) => {
        await serviceTasks.deleteTask(taskId);
        getTasks();
    }

    const changeToCompleted = async (taskId: string) => {
        await serviceTasks.completeTask(taskId);
        getTasks();
    }

    const generateRandomTasks = async () => {
        console.log("hola");
        try {
            setEnableButton(true); // Deshabilitar el botón y mostrar "Loading..."
            const answer = await serviceTasks.randomTasks(idUser); // Generar tareas
            await getTasks(); 
            alert(answer.data);
        } catch (error) {
            console.error("Error generating tasks:", error);
        } finally {
            setEnableButton(false); // Habilitar el botón nuevamente después de la generación
        }
        console.log(enableButton);
    };

  return (
    <div className={styles['main-container']}>
    <div className={styles['task-form']}>
        <div className={styles['form-group']}>
            <label htmlFor="taskTitle"><b>Title</b></label>
            <input 
                type="text" 
                id="taskTitle" 
                placeholder="Enter a title (no more than 30 characters)" 
                maxLength={30} 
                value={taskName}
                onChange={handleNameChange}
            />
        </div>
        <div className={styles['form-group']}>
            <label htmlFor="taskDescription"><b>Description</b></label>
            <textarea 
                className={styles['taskDescription']} 
                placeholder="Enter a description (no more than 50 characters)" 
                maxLength={50} 
                value={taskDescription}
                onChange={handleDescriptionChange}
            ></textarea>
        </div>
        <div className={styles['form-group']} id={styles['radio-b']}>
            <label><b>Difficulty</b></label>
            <div className={styles['form-group']}>
                <span className={styles['opcion-radio']}>
                    <input type="radio" id="High" name="taskDifficulty"  
                    value="High"
                    checked={ taskDifficulty === 'High' }
                    onChange={handleDifficultyChange}/>
                    <label htmlFor="High">High</label>
                </span>

                <span className={styles['opcion-radio']}>
                    <input type="radio" id="Middle" name="taskDifficulty" 
                   value="Middle"
                   checked={ taskDifficulty === 'Middle' }
                   onChange={handleDifficultyChange}/>
                    <label htmlFor="Middle">Middle</label>
                </span>

                <span className={styles['opcion-radio']}>
                    <input type="radio" id="Low" name="taskDifficulty" 
                    value="Low"
                    checked={ taskDifficulty === 'Low' }
                    onChange={handleDifficultyChange} />
                    <label htmlFor="Low">Low</label>
                </span>
            </div>
        </div>

        <div className={styles['form-group']}>
            <label htmlFor="taskPriority"><b>Priority</b></label>
            <select id="taskPriority" className={styles['taskPriority']} value={taskPriority} onChange={handlePriorityChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
        </div>
        <div className={styles['form-group']}>
            <label htmlFor="averageTime"><b>Average Time</b></label>
            <input 
                type="number" 
                id="averageTime" 
                placeholder="Enter average time" 
                step="0.1" 
                min="0" 
                value={taskTime}
                onChange={handleTimeChange}
            />
        </div>
        <div className={styles['date-container']}>
            <div className={styles['date-input']}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <input type="date" id="taskDueDate" 
                value={taskDate}
                onChange={handleDateChange}/>
            </div>
            <button onClick={() => addTask()}>Add</button>
        </div>
        <button onClick={() => generateRandomTasks()} disabled={enableButton}>{enableButton ? 'Loading...' : 'Generate Random Tasks' }</button> 
        
    </div>
    <div className={styles['task-container']}>
        {post.map((task, i) => <Load
        key={i}
        id={task.id}
        name={task.name}
        description={task.description}
        isCompleted={task.isCompleted}
        priority={task.priority}
        difficulty={task.difficulty}
        dueDate={task.dueDate}
        creationDate={task.creationDate}
        estimatedTime={task.estimatedTime}
        onDelete={deleteTask}
        onCheckboxChange={changeToCompleted}
        ></Load> )}
    </div>
</div>
)
}
