odoo.define('vr_array_vat.models', function (require) {
    var models = require('point_of_sale.models');
    var _super_posmodel = models.PosModel.prototype;

    models.load_fields('res.partner', ['vat']);
    console.log('models', models);

    models.PosModel = models.PosModel.extend({
        initialize: function (session, attributes) {
            var partner_model = _.find(this.models, function (model) {
                return model.model === 'res.partner';
            });
            partner_model.fields.push('rz_nit_lines_ids');
            return _super_posmodel.initialize.call(this, session, attributes);
        },
    });
    models.load_fields('res.partner', ['razon_social', 'nit_ci']);

    models.load_models([
        {
            model: 'rz.nit.lines',
            label: 'load_rz_nit_lines',
            condition: function (self) {
                return true;
            },
            fields: ['id', 'partner_id', 'nit', 'razon_social'],
            domain: function (self) {
                return [];
            },
            loaded: function (self, result) {
                    self.set({'rz_nit_lines_ids_list': result});
            },
        },
    ], {'after': 'res.partner'});
});