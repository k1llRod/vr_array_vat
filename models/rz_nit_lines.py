# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
from odoo.exceptions import UserError


class rz_nit_lines(models.Model):
    _name = 'rz.nit.lines'
    _description = "Nit y Razon social res.partner"
    partner_id = fields.Many2one('res.partner', string='Id')
    razon_social = fields.Char(string='Razon Social')
    nit = fields.Char(string='nit')

