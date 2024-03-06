from odoo import api, fields, models
from odoo.exceptions import ValidationError

class HrEmployee(models.Model):
	_inherit = 'hr.employee'
	
	# Method to retrieve attendance projects
	@api.model
	def get_projects(self):
		projects = self.env['project.project'].search([
			('task_ids', '!=', False),
			('user_id', '=', self.env.user.id)
		])
		tasks = projects.mapped('task_ids')
		return {
			'project_ids': [{'id':project.id, 'name':project.name} for project in projects],
			'task_ids': [{'id':task.id, 'name':task.name, 'project_id':task.project_id.id} for task in tasks],
		}

	 
	def _attendance_action_change(self):
		res = super(HrEmployee, self)._attendance_action_change()
		
		# Get values from the context
		project_id = int(self.env.context.get('project_id')) or False
		task_id = int(self.env.context.get('task_id')) or False
		attendance_description = str(self.env.context.get('attendance_description')) or False
		if project_id and task_id and attendance_description:
			description_log = self.env['attendance.description.log'].create(
				{  'description':attendance_description,
					'attendance_id':res.id
				})
			vals = {
				'project_id': project_id,
				'task_id': task_id,
				'description': attendance_description,
				'description_log_ids': [(4, description_log.id, 0)],
			}
			res.update(vals)
		else:
			raise ValidationError('Some required values are missing to create the description log.')

		return res
