# -*- coding: utf-8 -*-
{
    'name': 'Project Task Attendace',
    'version': '16.0.0.1',
    'category': 'Human Resources',
    'author': 'Ehtisham Faisal  ',
    'summary': 'Enhance the existing Attendance module in Odoo with project selection and description functionality.',
    'description': """
        This module enhances Odoo's Attendance module to allow users to:
        - Select a Project while check-in.
        - Select a Task that is related to selected project.
        - Write Descriptions for activities during check-in and check-out.
        """,
    'website': 'https://github.com/ehtishamfaisal',
    'depends': ['base', 'hr_attendance', 'project'],
    'data': [
        'security/ir.model.access.csv',

        'views/inherit_hr_attendance_view.xml',
    ],
    'demo': [],
    'icon': 'project_task_attendance/static/description/icon.png',
    'images': ["static/description/images/image1.png","static/description/images/image2.png","static/description/images/image3.png","static/description/images/image4.png"],
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
    'assets': {
        'web.assets_backend': [
            '/project_task_attendance/static/src/js/project_task_attandance.js',
            '/project_task_attendance/static/src/xml/**/*'
        ],
    },
}