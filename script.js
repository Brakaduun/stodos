const app = new Vue({
    el: "#main",
    data() {
        return {
            tasks: {},
            done_collapsed: true,
            input_visible: false,
            input_value: ""
        }
    },
    methods: {
        moveToDone(idx) {
            this.tasks.active[idx]._hover = false
            this.tasks.active[idx].label = this.tasks.active[idx].label.replace("[UNDONE] ", "")
            this.tasks.done.splice(0, 0, this.tasks.active[idx])
            this.$delete(this.tasks.active, idx)
            this.saveTasks()
        },
        moveToActive(idx) {
            this.tasks.done[idx]._hover = false
            this.tasks.done[idx].label = "[UNDONE] " + this.tasks.done[idx].label
            this.tasks.active.splice(0, 0, this.tasks.done[idx])
            this.$delete(this.tasks.done, idx)
            this.saveTasks()
        },
        deleteActive(idx) {
            this.tasks.active.splice(idx, 1)
            this.saveTasks()
        },
        deleteDone(idx) {
            this.tasks.done.splice(idx, 1)
            this.saveTasks()
        },
        showInput() {
            this.input_visible = true
            this.$nextTick(() => {
                this.input_value = ""
                this.$refs.newTask.focus()
            })
        },
        addTask() {
            this.tasks.active.splice(0, 0, {label: this.input_value, _hover: false})
            this.input_visible = false
            this.saveTasks()
        },
        saveTasks() {
            let prepTasks = {
                active: this.tasks.active.map(t => this.prepareTask(t)),
                done: this.tasks.done.map(t => this.prepareTask(t))
            }
            localStorage.setItem('tasks', JSON.stringify(prepTasks))
        },
        prepareTask(task) {
            let ntask = {}
            for (let key in task) {
                if (key[0] != "_") {
                    ntask[key] = task[key]
                }
            }
            return ntask
        },
        editActiveTask(idx)
        {
            this.tasks.active[idx]._edit = true
            this.$nextTick(()=>{
                this.$refs['activeEdit_'+idx][0].select()
            })
        },
        editDoneTask(idx)
        {
            this.tasks.done[idx]._edit = true
            this.$nextTick(()=>{
                this.$refs['doneEdit_'+idx][0].select()
            })
        },
        cancelEditActiveTask(idx) {
            this.tasks.active[idx]._edit = false
        },
        cancelEditDoneTask(idx) {
            this.tasks.active[idx]._edit = false
        },
        saveActiveTask(idx) {
            this.tasks.active[idx].label = 
                this.$refs['activeEdit_'+idx][0].value
            this.tasks.active[idx]._edit = false
            this.saveTasks()
        },
        saveDoneTask(idx) {
            this.tasks.done[idx].label = 
                this.$refs['doneEdit_'+idx][0].value
            this.tasks.done[idx]._edit = false
            this.saveTasks()
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
        let st = JSON.parse(localStorage.getItem('tasks'))
        this.tasks = {
                active: st.active.map(i => {
                    i._done = false; 
                    i._edit = false;
                    return i}),
                done: st.done.map(i => {
                    i._done = false; 
                    i._edit = false;
                    return i
                })
        }
    }
})





