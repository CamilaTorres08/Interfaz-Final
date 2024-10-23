import React, { useEffect, useState } from 'react';
import styles from './Task.module.css'

type Props = {
    id?: string;
    name: string;
    description: string;
    isCompleted?: boolean;
    priority: number;
    difficulty: string;
    dueDate: string;
    creationDate?: string;
    estimatedTime: number;
    onCheckboxChange: (id: string) => void;
    onDelete: (id: string) => void;
};

export default function Load(props: Props) {
    const {
        id,
        name,
        description,
        isCompleted,
        priority,
        difficulty,
        dueDate,
        creationDate,
        estimatedTime,
        onCheckboxChange,
        onDelete
    } = props;
    const [header, setHeader] = useState('');
    useEffect(() => {
        switch (priority){
            case 1:
                setHeader('first-priority');
                break;
            case 2:
                setHeader('second-priority');
                break;
            case 3:
                setHeader('third-priority');
                break;
            case 4:
                setHeader('four-priority');
                break;
            case 5:
                setHeader('five-priority');
                break;
            default:
                setHeader('');
                break;
        }
      }, []);

    const handleCheckboxChange = () => {
        if (id){
            onCheckboxChange(id);
        }
    };

    const handleDelete = () => {
        if (id){
            onDelete(id);
        }
    };

    const completedClass = isCompleted ? 'COMPLETED' : '';

    
    
    return (
        <div className={[styles.task, styles[completedClass]].join(' ')}>
            <input
                type="checkbox"
                className={styles['task-checkbox']}
                onChange={handleCheckboxChange}
                checked={isCompleted}
                disabled={isCompleted}
            />
            <div className={styles['task-priority']}>
                <div className={[styles['circle'], styles[header]].join(' ')}><span>{priority}</span></div>
                <h2>{name}</h2>
            </div>
            <p style={{ opacity: 0.8 }}>{description}</p>
            <p style={{ opacity: 0.8 }}><i className="fas fa-calendar-alt"></i> Creation date: {creationDate}</p>
            <p style={{ opacity: 0.8 }}><i className="fas fa-calendar-check"></i> Due date: {dueDate}</p>
            <p style={{ opacity: 0.8 }}><i className="fas fa-exclamation-circle"></i> Difficulty: {difficulty}</p>
            <p style={{ opacity: 0.8 }}><i className="fas fa-clock"></i> Estimated Time: {estimatedTime.toFixed(1)} hours</p>
            <button className={styles['delete-button']} onClick={handleDelete}><i className="fas fa-trash-alt"></i></button>
        </div>
    );
}

