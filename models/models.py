# -*- coding: utf-8 -*-

# from odoo import models, fields, api


# class vr_array_vat(models.Model):
#     _name = 'vr_array_vat.vr_array_vat'
#     _description = 'vr_array_vat.vr_array_vat'

#     name = fields.Char()
#     value = fields.Integer()
#     value2 = fields.Float(compute="_value_pc", store=True)
#     description = fields.Text()
#
#     @api.depends('value')
#     def _value_pc(self):
#         for record in self:
#             record.value2 = float(record.value) / 100
