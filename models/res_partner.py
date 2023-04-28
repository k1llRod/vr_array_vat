# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
from odoo.exceptions import UserError


class ResPartner(models.Model):
    _inherit = 'res.partner'


    rz_nit_lines_ids = fields.One2many('rz.nit.lines', 'partner_id', 'NIT y Razones Asociados')

    @api.model
    def register_nit_razon(self, vals):
        buscar = self.env['rz.nit.lines'].search(
            [('partner_id', '=', vals['partner_id']), ('nit', '=', vals['nit']), ('razon_social', '=', vals['razon_social'])])
        if len(buscar) == 0:
            vals['partner_id'] = vals['partner_id']
            vals['razon_social'] = vals.pop('razon_social')
            vals['nit'] = vals['nit']
            return self.env['rz.nit.lines'].create(vals).id
        return 0

    @api.model
    def verify_duplicate_vat(self, vals):
        verify_vat = self.search([('vat','=',vals['vat'])])
        if len(verify_vat) > 0:
            return True
        else:
            return False
