const app = new Vue({
    el: "#main",
    data() {
        return {
            tasks: [],
            done_collapsed: true,
            input_visible: false,
            input_value: ""
        }
    },
    computed: {
        activeTasks() {
            return this.tasks.filter (t => { return t.done == "0" })
        },
        doneTasks() {
            return this.tasks.filter (t => { return t.done == "1" })
        }
    },
    methods: {
        showInput() {
            this.input_visible = true
            this.$nextTick(() => {
                this.input_value = ""
                this.$refs.newTask.focus()
            })
        },
        editTask(task)
        {
            task._edit = true
            this.$nextTick(()=>{
                this.$refs['edit_'+task.id][0].select()
            })
        },
        deleteActive(idx) {
            this.tasks.active.splice(idx, 1)
            this.saveTasks()
        },

        deleteDone(idx) {
            this.tasks.done.splice(idx, 1)
            this.saveTasks()
        },

        addTask() {
            let params = {label: this.input_value, done: "0"}
            $.post("tasks.php?action=insert", params)
                .done(response => {
                    if (response == "KO") {
                        alert("Insert task failed!")
                        return
                    }
                    else {
                        task = {label: this.input_value, 
                                done: false, 
                                id: response,
                                _hover: false,
                                _edit: false}
                        this.tasks.push(task)
                        this.input_visible = false
                        return
                    }
                    alert("[updateTaskStatusDb] Unknown response")
                })
                .fail(jqXHR => {
                    console.log(jqXHR)
                    alert("Insert task failed!")
                })
        },
        updateTaskStatusDb(task, done) {
            let params = {id: task.id, done: done ? "1" : "0"}
            $.post("tasks.php?action=update_status", params)
            .done(response => {
                if (response == "KO") {
                    alert("Update task status failed!")
                    return
                }
                if (response == "OK") {
                    task.done = done ? "1" : "0"
                    task._hover = false
                    if (done) {
                        task.label = task.label.replace("[UNDONE] ", "")
                    }
                    else {
                        task._hover = false
                        task.label = "[UNDONE] " + task.label
                    }
                    return
                }
                alert("[updateTaskStatusDb] Unknown response")
            })
            .fail(jqXHR => {
                console.log(jqXHR)
                alert("Update task status failed!")
            })
        },
        updateTaskDb(task) {
            let params = {id: task.id, label: this.$refs['edit_'+task.id][0].value}
            $.post("tasks.php?action=update", params)
            .done(response => {
                if (response == "KO") {
                    alert("Update task failed!")
                    return
                }
                if (response == "OK") {
                    task.label = this.$refs['edit_'+task.id][0].value
                    task._edit = false
                    return
                }
                alert("[updateTaskStatusDb] Unknown response")
            })
            .fail(jqXHR => {
                console.log(jqXHR)
                alert("Update task failed!")
            })
        },
        deleteTaskDb(task) {
            $.post("tasks.php?action=delete", {id: task.id})
            .done(response => {
                if (response == "KO") {
                    alert("Delete task failed!")
                    return
                }
                if (response == "OK") {
                    let idx = this.tasks.findIndex((st) => task.id == st.id)
                    console.log(idx)
                    this.tasks.splice(idx, 1)
                    return
                }
                alert("[updateTaskStatusDb] Unknown response")
            })
            .fail(jqXHR => {
                console.log(jqXHR)
                alert("Update task failed!")
            })
        },

        exportCSV() {
            let header = "\"" + ["No.", "Label", "Status"].join("\";\"") + "\"";
            let bodyActive = this.tasks.active.map((t, idx) => {
                return "\"" + [idx+1, t.label, "ACTIVE"].join("\";\"") + "\""
            })
            let bodyDone = this.tasks.done.map((t, idx) => {
                return "\"" + [idx + bodyActive.length + 1, 
                               t.label, "DONE"].join("\";\"") + "\""
            })
            let csv = [header, ...bodyActive, ...bodyDone].join("\n")
            
            var downloadLink = document.createElement("a");
            downloadLink.href = 'data:text/csv,' + encodeURIComponent(csv);
            downloadLink.download = "my_tasks.csv";

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        },
    },
    created() {
        $.post('tasks.php?action=get')
         .done(data => {
             console.log(data)
             this.tasks = data.map(i => {
                    i._done = false; 
                    i._edit = false;
                    return i})
        }) 
        .fail(error => {
            console.log(error)
            alert('Retrieving tasks failed! ')
        })
        .always(()=>{
            //TODO
        })

    }
})





