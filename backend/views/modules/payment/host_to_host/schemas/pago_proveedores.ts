import builder from "xmlbuilder2";

export interface PagoProveedoresSchema {
  file_name: string;
  generated_file_date: string;
  quantity_transactions: number;
  total_amount: number;
  company_legal_name: string;
  company_contract_number: string;
  payment_date: string;
  payments: {
    debtor_legal_name: string;
    debtor_ruc: string;
    debtor_account: string;
    debtor_type_account: string;
    debtor_currency: string;
    debtor_reference: string;
    amount: number;
    creditor_name: string;
    creditor_document_identifier: string;
    creditor_account: string;
    creditor_type_account: string;
    creditor_currency: string;
    payment_document_type: string;
    payment_document_number: string;
    payment_document_amount: number;
  }[];
}

// prettier-ignore
export const xml_pago_proveedores = (_file_identifier:string,data: PagoProveedoresSchema): string => {
  // formato total: xxxxxxx.xx
  const REFERENCE="//N/N/000"

  const root=builder.create().ele('Document')
  const structure_payment=root.ele('CstmrCdtTrfInitn')

  structure_payment 
          .ele('GrpHdr')
            .ele('MsgId').txt(data.file_name).up()
            .ele('CreDtTm').txt(data.generated_file_date).up()
            .ele('Authstn').up()
            .ele('NbOfTxs').txt(data.quantity_transactions.toString()).up()
            .ele('CtrlSum').txt(data.total_amount.toString()).up()
            .ele('InitgPty')
              .ele('Nm').txt(data.company_legal_name).up()
              .ele('PstlAdr').up()
              .ele('Id')
                .ele('OrgId')
                  .ele('AnyBIC').up()
                  .ele('LEI').up()
                  .ele('Othr')
                    .ele('Id').txt(data.company_contract_number).up()
                    .ele('SchmeNm').up()
                  .up()
                  .ele('Issr').up()
                .up()
                .ele('PrvtId').up()
              .up()
              .ele('CtryOfRes').up()
              .ele('CtcDtls').up()
            .up()
            .ele('FwdgAgt').up()
          .up()
          // NOTA: LO DE ABAJO [1..*]

    

  data.payments.forEach((payment)=>{
    structure_payment.ele('PmtInf')
          .ele('PmtInfId').txt(data.file_name).up()
          .ele('PmtMtd').txt('TRF').up() // constante
          .ele('BtchBookg').up()
          .ele('NbOfTxs').txt('transacciones').up()
          .ele('CtrlSum').up()
          .ele('PmtTpInf')
            .ele('InstrPrty').up()
            .ele('LclInstrm').up()
            .ele('CtgyPurp')
              .ele('Cd').txt('SUPP').up() // Constante pago a proveedores
              .ele('Prtry').up()
            .up()
          .up()
          .ele('ReqdExctnDt')
            .ele('Dt').txt(data.payment_date).up()
            .ele('Dtm').up()
          .up()
          .ele('PoolgAdjstmntDt').up()
          .ele('Dbtr')
            .ele('Nm').txt(payment.debtor_legal_name).up()
            .ele('PstlAdr').up()
            .ele('Id')
              .ele('OrgId')
                .ele('AnyBIC').up()
                .ele('LEI').up()
                .ele('Othr')
                  .ele('Id').txt(payment.debtor_ruc).up()
                  .ele('SchmeNm').up()
                  .ele('Issr').up()
                .up()
              .up()
              .ele('PrvtId').up()
            .up()
            .ele('CtryOfRes').up()
            .ele('CtctDtls').up()
          .up()
          .ele('DbtrAcct')
            .ele('Id')
              .ele('IBAN').up()
              .ele('Othr')
                .ele('Id').txt(payment.debtor_account).up()
                .ele('SchmeNm').up()
              .up()
              .ele('Issr').up()
            .up()
            .ele('Tp')
                .ele('Cd').txt(payment.debtor_type_account).up()
                .ele('Prtry').up()
            .up()
            .ele('Ccy').txt(payment.debtor_currency).up()
            .ele('Nm').up()
            .ele('Prxy').up()
          .up()
          .ele('DbtrAgt')
            .ele('FinInstnId')
              .ele('BICFI').up()
              .ele('ClrSysMmbId').up()
              .ele('LEI').up()
              .ele('Nm').up()
              .ele('PstlAdr').up()
              .ele('Othr')
                .ele('Id').txt(payment.debtor_reference).up()
                .ele('SchmeNm').up()
                .ele('Issr').up()
              .up()
            .up()
          .up()
          .ele('DbtrAgtAcct').up()
          .ele('InstrForDbtrAgt').up()
          .ele('UltmtDbtr').up()
          .ele('ChrgBr').up()
          .ele('ChrgsAcct').up()
          .ele('ChrgsAcctAgt').up()
          .ele('CdtTrfTxInf')
            .ele('PmtId')
              .ele('InstrId').txt(data.file_name).up()
              .ele('EndToEndId').txt(data.file_name).up()
              .ele('UETR').up()
            .up()
            .ele('PmtTpInf').up()
            .ele('Amt')
              .ele('InstdAmt').txt(payment.amount.toString()).up()
              .ele('EqvtAmt').up()
            .up()
            .ele('XchgRateInf').up()
            .ele('ChrgBr').up()
            .ele('UltmtDbtr').up()
            .ele('IntrmyAgt1').up()
            .ele('IntrmyAgt1Acct').up()
            .ele('IntrmyAgt2').up()
            .ele('IntrmyAgt2Acct').up()
            .ele('IntrmyAgt3').up()
            .ele('IntrmyAgt3Acct').up()
            .ele('CdtrAgt').up()
            .ele('CdtrAgtAcct').up()
            .ele('Cdtr')
              .ele('Nm').txt(payment.creditor_name).up()
              .ele('PstlAdr').up()
              .ele('Id')
                .ele('OrgId')
                  .ele('AnyBIC').up()
                  .ele('LEI').up()
                  .ele('Othr')
                    .ele('Id').txt(payment.creditor_document_identifier).up()
                    .ele('SchmeNm').up()
                    .ele('Issr').up()
                  .up()
                .up()
                .ele('PrvtId').up()
              .up()
              .ele('CtryOfRes').up()
              .ele('CtcDtls')
                .ele('NmPrfx').up()
                .ele('Nm').up()
                .ele('PhneNb').up()
                .ele('MobNb').up()
                .ele('FaxNb').up()
                .ele('EmailAdr').up()
              .up()
            .up()
            .ele('CdtrAcct')
              .ele('Id')
                .ele('IBAN').up()
                .ele('Othr')
                  .ele('Id').txt(payment.creditor_account).up()
                  .ele('SchmeNm').up()
                  .ele('Issr').up()
                .up()
              .up()
              .ele('Tp')
                .ele('Cd').txt(payment.creditor_type_account).up()
                .ele('Prtry').up()
              .up()
              .ele('Ccy').txt(payment.creditor_currency).up()
              .ele('Nm').up()
              .ele('Proxy').up()
            .up()
            .ele('UltmtCdtr').up()
            .ele('InstrForCdtrAgt').up()
            .ele('InstrForDbtrAgt').up()
            .ele('Purp').up()
            .ele('RgltryRptg').up()
            .ele('Tax').up()
            .ele('RltdRmtInf').up()
            .ele('RmtInf')
              .ele('Ustrd').txt(REFERENCE).up() // AQUI FALTA CONSULTAR
              .ele('Strd')
                .ele('RfrdDocInf')
                  .ele('Tp')
                    .ele('CdOrPrtry')
                      .ele('Cd').txt(payment.payment_document_type).up()
                      .ele('Prtry').up()
                    .up()
                    .ele('Issr').up()
                  .up()
                  .ele('Nb').txt(payment.payment_document_number).up()
                  .ele('RltdDt').up()
                  .ele('LineDtls').up()
                .up()
                .ele('RfrdDocAmt')
                  .ele('DuePyblAmt').txt(payment.payment_document_amount.toString()).up()
                  .ele('DscntApldAmt').up()
                  .ele('CdtNoteAmt').up()
                  .ele('TaxAmt').up()
                  .ele('AdjstmntAmtAndRsn').up()
                  .ele('RmtdAmt').up()
                .up()
                .ele('CdtrRefInf').up()
                .ele('Invcr').up()
                .ele('Invcee').up()
                .ele('TaxRmt').up()
                .ele('GrnshmtRmt').up()
                .ele('AddtlRmtInf').up()
              .up()
            .up()
            .ele('SplmtryData').up()
          .up()
        .up()
  })
  
  structure_payment.ele('SplmtryData').up()


  const xmlString=structure_payment.end({prettyPrint: true,headless: true})

  Deno.writeTextFile('./content.txt',xmlString)

  return xmlString;
};
