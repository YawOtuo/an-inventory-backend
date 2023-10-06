
const { expect } = require('chai');
const sinon = require('sinon');
const { getAllItems } = require('../controllers/item.controllers');
const db = require('../models');
const server = require('../index')
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should()

chai.use(chaiHttp)
describe('Item Controller', () => {
  describe('getAllItems', () => {
    it('should return all items', (done) => {
      chai.request(server)
        .get('/items')
        .end((err, res) => {

          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
 
  })
  describe('Post Item',()=>{
    it('should add an an', (done) => {
      chai.request(server)
        .post('/items')
        .send({type:"shrt", description:"Lorem ipsum"})
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          done();
        });
    });
  })
})     