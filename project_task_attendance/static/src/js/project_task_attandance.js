odoo.define('project_task_attendance.project_task_attendance', function (require) {
    "use strict";

    // Import necessary modules
    const MyAttendances = require('hr_attendance.my_attendances');
    const session = require('web.session');

    // Extend MyAttendances widget
    MyAttendances.include({

        // Define events
        events: Object.assign({}, MyAttendances.prototype.events, {
            'change select[name="project_id"]': '_onChangeSelectProject',
            'click .o_hr_attendance_sign_in_out_icon': 'update_attendance',
        }),

        // Asynchronous method to fetch attendance projects before starting
        async willStart() {
            await this._super(...arguments);
            this.projects = await this._getProjects();
            console.log(this.projects);
        },

        // Asynchronous method to fetch attendance projects via RPC call
        async _getProjects() {
            return this._rpc({
                model: 'hr.employee',
                method: 'get_projects',
                args: [],
            });
        },
        
        // Overide update_attendace method to perfom validation 
        async update_attendance() {
            const project_id = this.$("select[name='project_id']").val();
            const task_id = this.$("select[name='task_id']").val();
            const attendance_description = this.$("textarea[name='attendance_description']").val();
            console.log("Employee",this.employee.id)
            if (! project_id){
                $( "<p class='mt-0 mb-0 project-alert'><span><i class='fa fa-exclamation-circle'></i></span> <span class='text-danger' style='font-size:1rem;'>Please select Project.</span></p>" ).insertAfter(this.$el.find('select[name="project_id"]').parents('div.row'))
            }

            else if (! task_id){
                this.$el.find('.project-alert').addClass('d-none');
                $( "<p class='mt-0 mb-0 task-alert'><span><i class='fa fa-exclamation-circle'></i></span> <span class='text-danger' style='font-size:1rem;'>Please select Task.</span></p>" ).insertAfter(this.$el.find('select[name="task_id"]').parents('div.row'))
            }

            else if (! attendance_description){
                this.$el.find('.project-alert').addClass('d-none');
                this.$el.find('.task-alert').addClass('d-none');
                $( "<p class='mt-0 mb-0 description-alert'><span><i class='fa fa-exclamation-circle'></i></span> <span class='text-danger' style='font-size:1rem;'>Please add your description.</span></p>" ).insertAfter(this.$el.find('textarea[name="attendance_description"]').parents('div.row'))
            }

            else{
                this.$el.find('.project-alert').addClass('d-none');
                this.$el.find('.task-alert').addClass('d-none');
                this.$el.find('.description-alert').addClass('d-none');
                const result = await this._rpc({
                    model: 'hr.employee',
                    method: 'attendance_manual',
                    args: [[this.employee.id], 'hr_attendance.hr_attendance_action_my_attendances'],
                    context: {
                        'project_id': project_id,
                        'task_id': task_id,
                        'attendance_description': attendance_description,
                    },
                });
                if (result.action) {
                    this.do_action(result.action);
                } else if (result.warning) {
                    this.do_warn(result.warning);
                }
            }
        },

        // Method to handle project selection change
        _onChangeSelectProject(ev) {
            const project_id = this.$("select[name='project_id']").val();
            let selectionTag = '<select class="form-control col-lg-10" name="task_id" id="task_id" optional="false" required>';
            selectionTag += '<option></option>';
            for (const task of this.projects.task_ids) {
                if (task.project_id == project_id) {
                    console.log(task)
                    selectionTag += `<option value="${task.id}">${task.name}</option>`;
                }
            }
            selectionTag += '</select>';
            this.$("#task_id").replaceWith(selectionTag);
        },

    });

    return MyAttendances; // Return MyAttendances widget
});
