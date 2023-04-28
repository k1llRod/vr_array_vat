odoo.define('vr_array_vat.ClientDetailsEdit', function (require) {

    const Registries = require('point_of_sale.Registries');
    const ClientDetailsEdit = require('point_of_sale.ClientDetailsEdit');
    var rpc = require('web.rpc');
    const OffClientDetailsEdit = (ClientDetailsEdit) =>
        class extends ClientDetailsEdit {
            partner_nit_razon() {
                console.log('TEST')
                const partner = this.props.partner;
                console.log('partner', partner);
                var nit_list = [];
                var nits_list = this.env.pos.get('rz_nit_lines_ids_list');
                console.log(nits_list)
                for (var k = 0; k < nits_list.length; k++) {
                    if (partner.id == nits_list[k].partner_id[0]) {
                        var n_list = {
                            'id': nits_list[k].id,
                            'nit': nits_list[k].nit,
                            'razon_social': nits_list[k].razon_social,
                            'partner_id': nits_list[k].partner_id[0],
                        };
                        nit_list.push(
                            n_list,
                        );
                    }
                }
                return {'nit_razon_list': nit_list};
            }

            async saveChanges() {
                var self = this;
                var order = this.env.pos.get_order();
                var vat = $('.vat').val()
                var sw = 1
                // var _super = this._super.bind(this);
                await rpc.query({
                    model: 'res.partner',
                    method: 'verify_duplicate_vat',
                    args: [{'vat': vat}]
                }).then(function (result) {
                    sw = result
                    // self.super.saveChanges();
                    console.log("VERIFICAR CLIENTE", result);
                }, function (type, err) {
                    console.log("INGRESA A LA FUNCION ERROR")
                });
                if (sw == true) {
                    return this.showPopup('ErrorPopup', {
                      title: ('Ya existe un cliente con el mismo NIT'),
                        body: ('Por favor verifique los datos ingresados'),
                    });
                } else {
                    super.saveChanges();
                }
                console.log('VERIFICAR SW', sw);
                console.log("ACTUALIZACION DE CLIENTE");
                console.log(sw);
            }
        }
    Registries.Component.extend(ClientDetailsEdit, OffClientDetailsEdit);
});