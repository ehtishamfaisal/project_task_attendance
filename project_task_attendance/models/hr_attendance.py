# -*- coding: utf-8 -*-
from odoo import models, fields

class HrAttendance(models.Model):
	_inherit = 'hr.attendance'
	
	# Fields Declaration
	project_id = fields.Many2one(
		'project.project', 
		string="Project",
		help="The project associated with this attendance record."
	)
	task_id = fields.Many2one(
		'project.task', 
		string="Task",
		domain="[('project_id','!=',False), ('project_id','=',project_id), ('is_closed','=',False)]",
		help="The task associated with this attendance record."
	)
	description = fields.Text(
		string="Description",
		help="Additional descriptions or notes for this attendance record.",

	)
	description_log_ids = fields.One2many('attendance.description.log', 'attendance_id', string='Description Logs')


class AttendanceDescriptionLog(models.Model):
	_name = 'attendance.description.log'
	_rec_name = 'description'
	_description = 'Attendance Description Log'

	# Define fields for the model
	description = fields.Text(string='Description Logs')
	attendance_id = fields.Many2one('hr.attendance', string='Attendance')
