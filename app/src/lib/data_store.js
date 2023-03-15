import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const localStore = (key, initial) => {  
    if(browser) {
        const toString = (value) => JSON.stringify(value, null, 2)  // helper function
        const toObj = JSON.parse                                    // helper function
      
        if (localStorage.getItem(key) === null) {                   // item not present in local storage
          localStorage.setItem(key, toString(initial))              // initialize local storage with initial value
        }
      
        const saved = toObj(localStorage.getItem(key))              // convert to object
      
        const { subscribe, set, update } = writable(saved)          // create the underlying writable store
      
        return {
          subscribe,
          set: (value) => {
            localStorage.setItem(key, toString(value))              // save also to local storage as a string
            return set(value)
          },
          update
        }
    } 
}

let app_data_init = {
  projects : [
    {
        name : "Project 1",
        master_include : true,
        id : "sfdlkfjas",
        lines : [
            {
                text : "A description of the project",
                toggled: true,
                include: true,
                id: Math.random().toString(20),
            }
        ],
    },
  ],
  skills : [
    {
        name : "Skill header :",
        master_include : true,
        id : "ldjkf;al",
        lines : [
            {
                text : "Skill 1",
                toggled: true,
                include: true,
                id: Math.random().toString(20),
            },
            {
                text : "Skill 2",
                toggled: true,
                include: true,
                id: Math.random().toString(20),
            }
        ],
    },
  ],
  objective : {
      name : "",
      master_include : true,
      id : "iokvddj",
      lines : [
          {
              text : "Give me a job pls",
              toggled: true,
              include: true,
              id: Math.random().toString(20),
          }
      ],
  },
  additional_courses : [
    {
        name : "Courses at UT Austin",
        master_include : true,
        id : "asfljk",
        lines : [
            {
                text : "Course 1 ,",
                toggled: false,
                include: true,
                id: Math.random().toString(20),
            },
            {
                text : "Course 2 ,",
                toggled: false,
                include: true,
                id: Math.random().toString(20),
            }
        ],
    },
  ],
  font_size : "12pt",
  font_size_small : "11pt",
  name : "Your Name",
  chips : {
    name : "",
    master_include : true,
    id : "ljksaf",
    lines : [
        {
            text : "xxx-xxx-xxxx",
            toggled: true,
            include: true,
            id: Math.random().toString(20),
        },
        {
            text : "Austin, Tx",
            toggled: true,
            include: true,
            id: Math.random().toString(20),
        }
    ],
  },
  work_data : [
    {
      name : "Company Name",
      id:  "sdlkfjasfj",
      date : "YYYY-MM-DD",
      master_include : true,
      lines : [
          {
              text : "Position",
              toggled: false,
              include: true,
              id: Math.random().toString(20),
          },
          {
              text : "Work line 1",
              toggled: true,
              include: true,
              id: Math.random().toString(20),
          },
          {
              text : "Work line 2",
              toggled: true,
              include: true,
              id: Math.random().toString(20),
          }
      ],
      scores : []
  }],
}   

export const app_data = localStore('app_data_27', app_data_init);
