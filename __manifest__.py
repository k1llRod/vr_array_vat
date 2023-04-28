# -*- coding: utf-8 -*-
{
    'name': "vr_array_vat",

    'summary': """
        Short (1 phrase/line) summary of the module's purpose, used as
        subtitle on modules listing or apps.openerp.com""",

    'description': """
        Long description of module's purpose
    """,

    'author': "My Company",
    'website': "http://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/14.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base','contacts','point_of_sale','stock'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/rz_nit_lines.xml',
        'views/res_partner.xml',
        'views/pos_template.xml',
    ],
    'qweb': [
        'static/src/xml/Screens/ClientDetailsEdit.xml',
        'static/src/xml/PaymentScreen.xml',
    ]

}
