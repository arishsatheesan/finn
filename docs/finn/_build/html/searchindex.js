Search.setIndex({docnames:["end_to_end_flow","finn","finn.analysis","finn.analysis.fpgadataflow","finn.core","finn.custom_op","finn.custom_op.fpgadataflow","finn.transformation","finn.transformation.fpgadataflow","finn.transformation.streamline","finn.util","getting_started","index","modules","source_code"],envversion:{"sphinx.domains.c":1,"sphinx.domains.changeset":1,"sphinx.domains.citation":1,"sphinx.domains.cpp":1,"sphinx.domains.javascript":1,"sphinx.domains.math":2,"sphinx.domains.python":1,"sphinx.domains.rst":1,"sphinx.domains.std":1,sphinx:56},filenames:["end_to_end_flow.rst","finn.rst","finn.analysis.rst","finn.analysis.fpgadataflow.rst","finn.core.rst","finn.custom_op.rst","finn.custom_op.fpgadataflow.rst","finn.transformation.rst","finn.transformation.fpgadataflow.rst","finn.transformation.streamline.rst","finn.util.rst","getting_started.rst","index.rst","modules.rst","source_code.rst"],objects:{"":{finn:[1,0,0,"-"]},"finn.analysis":{fpgadataflow:[3,0,0,"-"],topology:[2,0,0,"-"],verify_custom_nodes:[2,0,0,"-"]},"finn.analysis.fpgadataflow":{hls_synth_res_estimation:[3,0,0,"-"],res_estimation:[3,0,0,"-"]},"finn.analysis.fpgadataflow.hls_synth_res_estimation":{hls_synth_res_estimation:[3,1,1,""]},"finn.analysis.fpgadataflow.res_estimation":{res_estimation:[3,1,1,""]},"finn.analysis.topology":{all_tensors_f32:[2,1,1,""],get_per_tensor_fanouts:[2,1,1,""],is_linear:[2,1,1,""],node_inputs_in_expected_order:[2,1,1,""]},"finn.analysis.verify_custom_nodes":{verify_nodes:[2,1,1,""]},"finn.core":{datatype:[4,0,0,"-"],execute_custom_node:[4,0,0,"-"],modelwrapper:[4,0,0,"-"],onnx_exec:[4,0,0,"-"]},"finn.core.datatype":{DataType:[4,2,1,""]},"finn.core.datatype.DataType":{BINARY:[4,3,1,""],BIPOLAR:[4,3,1,""],FLOAT32:[4,3,1,""],INT16:[4,3,1,""],INT2:[4,3,1,""],INT32:[4,3,1,""],INT3:[4,3,1,""],INT4:[4,3,1,""],INT8:[4,3,1,""],TERNARY:[4,3,1,""],UINT16:[4,3,1,""],UINT2:[4,3,1,""],UINT32:[4,3,1,""],UINT3:[4,3,1,""],UINT4:[4,3,1,""],UINT8:[4,3,1,""],allowed:[4,4,1,""],bitwidth:[4,4,1,""],get_hls_datatype_str:[4,4,1,""],get_num_possible_values:[4,4,1,""],get_smallest_possible:[4,4,1,""],is_integer:[4,4,1,""],max:[4,4,1,""],min:[4,4,1,""],signed:[4,4,1,""]},"finn.core.execute_custom_node":{execute_custom_node:[4,1,1,""]},"finn.core.modelwrapper":{ModelWrapper:[4,2,1,""]},"finn.core.modelwrapper.ModelWrapper":{analysis:[4,4,1,""],check_all_tensor_shapes_specified:[4,4,1,""],check_compatibility:[4,4,1,""],find_consumer:[4,4,1,""],find_producer:[4,4,1,""],get_all_tensor_names:[4,4,1,""],get_initializer:[4,4,1,""],get_metadata_prop:[4,4,1,""],get_tensor_datatype:[4,4,1,""],get_tensor_fanout:[4,4,1,""],get_tensor_shape:[4,4,1,""],get_tensor_valueinfo:[4,4,1,""],graph:[4,4,1,""],make_empty_exec_context:[4,4,1,""],make_new_valueinfo_name:[4,4,1,""],model:[4,4,1,""],rename_tensor:[4,4,1,""],save:[4,4,1,""],set_initializer:[4,4,1,""],set_metadata_prop:[4,4,1,""],set_tensor_datatype:[4,4,1,""],set_tensor_shape:[4,4,1,""],transform:[4,4,1,""]},"finn.core.onnx_exec":{compare_execution:[4,1,1,""],execute_node:[4,1,1,""],execute_onnx:[4,1,1,""],execute_onnx_and_make_model:[4,1,1,""]},"finn.custom_op":{CustomOp:[5,2,1,""],fpgadataflow:[6,0,0,"-"],multithreshold:[5,0,0,"-"],registry:[5,0,0,"-"],streamingdataflowpartition:[5,0,0,"-"],xnorpopcount:[5,0,0,"-"]},"finn.custom_op.CustomOp":{execute_node:[5,4,1,""],get_nodeattr:[5,4,1,""],get_nodeattr_types:[5,4,1,""],infer_node_datatype:[5,4,1,""],make_shape_compatible_op:[5,4,1,""],set_nodeattr:[5,4,1,""],verify_node:[5,4,1,""]},"finn.custom_op.fpgadataflow":{HLSCustomOp:[6,2,1,""],convolutioninputgenerator:[6,0,0,"-"],streamingfclayer_batch:[6,0,0,"-"],streamingmaxpool_batch:[6,0,0,"-"],templates:[6,0,0,"-"],tlastmarker:[6,0,0,"-"]},"finn.custom_op.fpgadataflow.HLSCustomOp":{blackboxfunction:[6,4,1,""],bram_estimation:[6,4,1,""],code_generation_ipgen:[6,4,1,""],code_generation_npysim:[6,4,1,""],compile_singlenode_code:[6,4,1,""],dataoutstrm:[6,4,1,""],defines:[6,4,1,""],docompute:[6,4,1,""],dynamic_input_to_npy:[6,4,1,""],exec_precompiled_singlenode_model:[6,4,1,""],execute_node:[6,4,1,""],generate_params:[6,4,1,""],get_folded_input_shape:[6,4,1,""],get_folded_output_shape:[6,4,1,""],get_instream_width:[6,4,1,""],get_nodeattr_types:[6,4,1,""],get_number_output_values:[6,4,1,""],get_outstream_width:[6,4,1,""],global_includes:[6,4,1,""],ipgen_singlenode_code:[6,4,1,""],lut_estimation:[6,4,1,""],node_res_estimation:[6,4,1,""],npy_to_dynamic_output:[6,4,1,""],pragmas:[6,4,1,""],read_npy_data:[6,4,1,""],reset_rtlsim:[6,4,1,""],rtlsim:[6,4,1,""],save_as_npy:[6,4,1,""],strm_decl:[6,4,1,""],toggle_clk:[6,4,1,""]},"finn.custom_op.fpgadataflow.convolutioninputgenerator":{ConvolutionInputGenerator:[6,2,1,""]},"finn.custom_op.fpgadataflow.convolutioninputgenerator.ConvolutionInputGenerator":{blackboxfunction:[6,4,1,""],bram_estimation:[6,4,1,""],dataoutstrm:[6,4,1,""],defines:[6,4,1,""],docompute:[6,4,1,""],execute_node:[6,4,1,""],get_input_datatype:[6,4,1,""],get_nodeattr_types:[6,4,1,""],get_number_output_values:[6,4,1,""],get_output_datatype:[6,4,1,""],get_stream_width:[6,4,1,""],global_includes:[6,4,1,""],infer_node_datatype:[6,4,1,""],lut_estimation:[6,4,1,""],make_shape_compatible_op:[6,4,1,""],pragmas:[6,4,1,""],read_npy_data:[6,4,1,""],save_as_npy:[6,4,1,""],strm_decl:[6,4,1,""],verify_node:[6,4,1,""]},"finn.custom_op.fpgadataflow.streamingfclayer_batch":{StreamingFCLayer_Batch:[6,2,1,""]},"finn.custom_op.fpgadataflow.streamingfclayer_batch.StreamingFCLayer_Batch":{blackboxfunction:[6,4,1,""],bram_estimation:[6,4,1,""],calc_tmem:[6,4,1,""],calc_wmem:[6,4,1,""],dataoutstrm:[6,4,1,""],defines:[6,4,1,""],docompute:[6,4,1,""],execute_node:[6,4,1,""],generate_params:[6,4,1,""],get_folded_input_shape:[6,4,1,""],get_folded_output_shape:[6,4,1,""],get_hls_compatible_threshold_tensor:[6,4,1,""],get_hls_compatible_weight_tensor:[6,4,1,""],get_input_datatype:[6,4,1,""],get_instream_width:[6,4,1,""],get_nodeattr_types:[6,4,1,""],get_number_output_values:[6,4,1,""],get_output_datatype:[6,4,1,""],get_outstream_width:[6,4,1,""],get_template_param_values:[6,4,1,""],get_weight_datatype:[6,4,1,""],global_includes:[6,4,1,""],infer_node_datatype:[6,4,1,""],lut_estimation:[6,4,1,""],make_shape_compatible_op:[6,4,1,""],pragmas:[6,4,1,""],read_npy_data:[6,4,1,""],save_as_npy:[6,4,1,""],strm_decl:[6,4,1,""],verify_node:[6,4,1,""]},"finn.custom_op.fpgadataflow.streamingmaxpool_batch":{StreamingMaxPool_Batch:[6,2,1,""]},"finn.custom_op.fpgadataflow.streamingmaxpool_batch.StreamingMaxPool_Batch":{blackboxfunction:[6,4,1,""],bram_estimation:[6,4,1,""],dataoutstrm:[6,4,1,""],defines:[6,4,1,""],docompute:[6,4,1,""],get_nodeattr_types:[6,4,1,""],get_number_output_values:[6,4,1,""],global_includes:[6,4,1,""],infer_node_datatype:[6,4,1,""],lut_estimation:[6,4,1,""],make_shape_compatible_op:[6,4,1,""],pragmas:[6,4,1,""],read_npy_data:[6,4,1,""],save_as_npy:[6,4,1,""],strm_decl:[6,4,1,""],verify_node:[6,4,1,""]},"finn.custom_op.fpgadataflow.tlastmarker":{TLastMarker:[6,2,1,""]},"finn.custom_op.fpgadataflow.tlastmarker.TLastMarker":{blackboxfunction:[6,4,1,""],dataoutstrm:[6,4,1,""],defines:[6,4,1,""],docompute:[6,4,1,""],execute_node:[6,4,1,""],get_folded_input_shape:[6,4,1,""],get_folded_output_shape:[6,4,1,""],get_instream_width:[6,4,1,""],get_nodeattr_types:[6,4,1,""],get_number_output_values:[6,4,1,""],get_outstream_width:[6,4,1,""],global_includes:[6,4,1,""],infer_node_datatype:[6,4,1,""],make_shape_compatible_op:[6,4,1,""],pragmas:[6,4,1,""],read_npy_data:[6,4,1,""],save_as_npy:[6,4,1,""],strm_decl:[6,4,1,""],verify_node:[6,4,1,""]},"finn.custom_op.multithreshold":{MultiThreshold:[5,2,1,""],compare:[5,1,1,""],multithreshold:[5,1,1,""]},"finn.custom_op.multithreshold.MultiThreshold":{execute_node:[5,4,1,""],get_nodeattr_types:[5,4,1,""],infer_node_datatype:[5,4,1,""],make_shape_compatible_op:[5,4,1,""],verify_node:[5,4,1,""]},"finn.custom_op.registry":{getCustomOp:[5,1,1,""]},"finn.custom_op.streamingdataflowpartition":{StreamingDataflowPartition:[5,2,1,""]},"finn.custom_op.streamingdataflowpartition.StreamingDataflowPartition":{execute_node:[5,4,1,""],get_nodeattr_types:[5,4,1,""],infer_node_datatype:[5,4,1,""],make_shape_compatible_op:[5,4,1,""],verify_node:[5,4,1,""]},"finn.custom_op.xnorpopcount":{XnorPopcountMatMul:[5,2,1,""],xnorpopcountmatmul:[5,1,1,""]},"finn.custom_op.xnorpopcount.XnorPopcountMatMul":{execute_node:[5,4,1,""],get_nodeattr_types:[5,4,1,""],infer_node_datatype:[5,4,1,""],make_shape_compatible_op:[5,4,1,""],verify_node:[5,4,1,""]},"finn.transformation":{Transformation:[7,2,1,""],batchnorm_to_affine:[7,0,0,"-"],bipolar_to_xnor:[7,0,0,"-"],fold_constants:[7,0,0,"-"],fpgadataflow:[8,0,0,"-"],general:[7,0,0,"-"],infer_datatypes:[7,0,0,"-"],infer_shapes:[7,0,0,"-"],streamline:[9,0,0,"-"]},"finn.transformation.Transformation":{apply:[7,4,1,""]},"finn.transformation.batchnorm_to_affine":{BatchNormToAffine:[7,2,1,""]},"finn.transformation.batchnorm_to_affine.BatchNormToAffine":{apply:[7,4,1,""]},"finn.transformation.bipolar_to_xnor":{ConvertBipolarMatMulToXnorPopcount:[7,2,1,""]},"finn.transformation.bipolar_to_xnor.ConvertBipolarMatMulToXnorPopcount":{apply:[7,4,1,""]},"finn.transformation.fold_constants":{FoldConstants:[7,2,1,""]},"finn.transformation.fold_constants.FoldConstants":{apply:[7,4,1,""]},"finn.transformation.fpgadataflow":{cleanup:[8,0,0,"-"],codegen_ipgen:[8,0,0,"-"],codegen_ipstitch:[8,0,0,"-"],codegen_npysim:[8,0,0,"-"],compile:[8,0,0,"-"],convert_to_hls_layers:[8,0,0,"-"],create_dataflow_partition:[8,0,0,"-"],hlssynth_ipgen:[8,0,0,"-"],insert_tlastmarker:[8,0,0,"-"],make_deployment:[8,0,0,"-"],make_pynq_driver:[8,0,0,"-"],make_pynq_proj:[8,0,0,"-"],synth_pynq_proj:[8,0,0,"-"],templates:[8,0,0,"-"]},"finn.transformation.fpgadataflow.cleanup":{CleanUp:[8,2,1,""]},"finn.transformation.fpgadataflow.cleanup.CleanUp":{apply:[8,4,1,""]},"finn.transformation.fpgadataflow.codegen_ipgen":{CodeGen_ipgen:[8,2,1,""]},"finn.transformation.fpgadataflow.codegen_ipgen.CodeGen_ipgen":{apply:[8,4,1,""]},"finn.transformation.fpgadataflow.codegen_ipstitch":{CodeGen_ipstitch:[8,2,1,""]},"finn.transformation.fpgadataflow.codegen_ipstitch.CodeGen_ipstitch":{apply:[8,4,1,""]},"finn.transformation.fpgadataflow.codegen_npysim":{CodeGen_npysim:[8,2,1,""]},"finn.transformation.fpgadataflow.codegen_npysim.CodeGen_npysim":{apply:[8,4,1,""]},"finn.transformation.fpgadataflow.compile":{Compile:[8,2,1,""]},"finn.transformation.fpgadataflow.compile.Compile":{apply:[8,4,1,""]},"finn.transformation.fpgadataflow.convert_to_hls_layers":{InferBinaryStreamingFCLayer:[8,2,1,""]},"finn.transformation.fpgadataflow.convert_to_hls_layers.InferBinaryStreamingFCLayer":{apply:[8,4,1,""]},"finn.transformation.fpgadataflow.create_dataflow_partition":{CreateDataflowPartition:[8,2,1,""]},"finn.transformation.fpgadataflow.create_dataflow_partition.CreateDataflowPartition":{apply:[8,4,1,""]},"finn.transformation.fpgadataflow.hlssynth_ipgen":{HLSSynth_IPGen:[8,2,1,""]},"finn.transformation.fpgadataflow.hlssynth_ipgen.HLSSynth_IPGen":{apply:[8,4,1,""]},"finn.transformation.fpgadataflow.insert_tlastmarker":{InsertTLastMarker:[8,2,1,""]},"finn.transformation.fpgadataflow.insert_tlastmarker.InsertTLastMarker":{apply:[8,4,1,""]},"finn.transformation.fpgadataflow.make_deployment":{DeployToPYNQ:[8,2,1,""]},"finn.transformation.fpgadataflow.make_deployment.DeployToPYNQ":{apply:[8,4,1,""]},"finn.transformation.fpgadataflow.make_pynq_driver":{MakePYNQDriver:[8,2,1,""]},"finn.transformation.fpgadataflow.make_pynq_driver.MakePYNQDriver":{apply:[8,4,1,""]},"finn.transformation.fpgadataflow.make_pynq_proj":{MakePYNQProject:[8,2,1,""]},"finn.transformation.fpgadataflow.make_pynq_proj.MakePYNQProject":{apply:[8,4,1,""]},"finn.transformation.fpgadataflow.synth_pynq_proj":{SynthPYNQProject:[8,2,1,""]},"finn.transformation.fpgadataflow.synth_pynq_proj.SynthPYNQProject":{apply:[8,4,1,""]},"finn.transformation.general":{ConvertSubToAdd:[7,2,1,""],GiveRandomTensorNames:[7,2,1,""],GiveReadableTensorNames:[7,2,1,""],GiveUniqueNodeNames:[7,2,1,""]},"finn.transformation.general.ConvertSubToAdd":{apply:[7,4,1,""]},"finn.transformation.general.GiveRandomTensorNames":{apply:[7,4,1,""]},"finn.transformation.general.GiveReadableTensorNames":{apply:[7,4,1,""]},"finn.transformation.general.GiveUniqueNodeNames":{apply:[7,4,1,""]},"finn.transformation.infer_datatypes":{InferDataTypes:[7,2,1,""]},"finn.transformation.infer_datatypes.InferDataTypes":{apply:[7,4,1,""]},"finn.transformation.infer_shapes":{InferShapes:[7,2,1,""]},"finn.transformation.infer_shapes.InferShapes":{apply:[7,4,1,""]},"finn.transformation.streamline":{Streamline:[9,2,1,""],absorb:[9,0,0,"-"],collapse_repeated:[9,0,0,"-"],reorder:[9,0,0,"-"],round_thresholds:[9,0,0,"-"],sign_to_thres:[9,0,0,"-"]},"finn.transformation.streamline.Streamline":{apply:[9,4,1,""]},"finn.transformation.streamline.absorb":{Absorb1BitMulIntoMatMul:[9,2,1,""],AbsorbAddIntoMultiThreshold:[9,2,1,""],AbsorbMulIntoMultiThreshold:[9,2,1,""],FactorOutMulSignMagnitude:[9,2,1,""]},"finn.transformation.streamline.absorb.Absorb1BitMulIntoMatMul":{apply:[9,4,1,""]},"finn.transformation.streamline.absorb.AbsorbAddIntoMultiThreshold":{apply:[9,4,1,""]},"finn.transformation.streamline.absorb.AbsorbMulIntoMultiThreshold":{apply:[9,4,1,""]},"finn.transformation.streamline.absorb.FactorOutMulSignMagnitude":{apply:[9,4,1,""]},"finn.transformation.streamline.collapse_repeated":{CollapseRepeatedAdd:[9,2,1,""],CollapseRepeatedMul:[9,2,1,""],CollapseRepeatedOp:[9,2,1,""]},"finn.transformation.streamline.collapse_repeated.CollapseRepeatedOp":{apply:[9,4,1,""]},"finn.transformation.streamline.reorder":{MoveAddPastMul:[9,2,1,""],MoveScalarAddPastMatMul:[9,2,1,""],MoveScalarMulPastMatMul:[9,2,1,""]},"finn.transformation.streamline.reorder.MoveAddPastMul":{apply:[9,4,1,""]},"finn.transformation.streamline.reorder.MoveScalarAddPastMatMul":{apply:[9,4,1,""]},"finn.transformation.streamline.reorder.MoveScalarMulPastMatMul":{apply:[9,4,1,""]},"finn.transformation.streamline.round_thresholds":{RoundAndClipThresholds:[9,2,1,""]},"finn.transformation.streamline.round_thresholds.RoundAndClipThresholds":{apply:[9,4,1,""]},"finn.transformation.streamline.sign_to_thres":{ConvertSignToThres:[9,2,1,""]},"finn.transformation.streamline.sign_to_thres.ConvertSignToThres":{apply:[9,4,1,""]},"finn.util":{basic:[10,0,0,"-"],data_packing:[10,0,0,"-"],fpgadataflow:[10,0,0,"-"],onnx:[10,0,0,"-"],test:[10,0,0,"-"]},"finn.util.basic":{CppBuilder:[10,2,1,""],calculate_signed_dot_prod_range:[10,1,1,""],gen_finn_dt_tensor:[10,1,1,""],get_by_name:[10,1,1,""],get_finn_root:[10,1,1,""],interleave_matrix_outer_dim_from_partitions:[10,1,1,""],make_build_dir:[10,1,1,""],pad_tensor_to_multiple_of:[10,1,1,""],random_string:[10,1,1,""],remove_by_name:[10,1,1,""],roundup_to_integer_multiple:[10,1,1,""]},"finn.util.basic.CppBuilder":{append_includes:[10,4,1,""],append_sources:[10,4,1,""],build:[10,4,1,""],set_executable_path:[10,4,1,""]},"finn.util.data_packing":{array2hexstring:[10,1,1,""],finnpy_to_packed_bytearray:[10,1,1,""],hexstring2npbytearray:[10,1,1,""],npbytearray2hexstring:[10,1,1,""],npy_to_rtlsim_input:[10,1,1,""],numpy_to_hls_code:[10,1,1,""],pack_innermost_dim_as_hex_string:[10,1,1,""],packed_bytearray_to_finnpy:[10,1,1,""],rtlsim_output_to_npy:[10,1,1,""],unpack_innermost_dim_from_hex_string:[10,1,1,""]},"finn.util.fpgadataflow":{IPGenBuilder:[10,2,1,""],pyverilate_stitched_ip:[10,1,1,""]},"finn.util.fpgadataflow.IPGenBuilder":{append_tcl:[10,4,1,""],build:[10,4,1,""],set_ipgen_path:[10,4,1,""]},"finn.util.onnx":{valueinfo_to_tensor:[10,1,1,""]},"finn.util.test":{get_test_model_def_fxn:[10,1,1,""],get_test_model_trained:[10,1,1,""],get_test_model_untrained:[10,1,1,""],get_trained_checkpoint:[10,1,1,""]},finn:{analysis:[2,0,0,"-"],core:[4,0,0,"-"],custom_op:[5,0,0,"-"],transformation:[7,0,0,"-"],util:[10,0,0,"-"]}},objnames:{"0":["py","module","Python module"],"1":["py","function","Python function"],"2":["py","class","Python class"],"3":["py","attribute","Python attribute"],"4":["py","method","Python method"]},objtypes:{"0":"py:module","1":"py:function","2":"py:class","3":"py:attribute","4":"py:method"},terms:{"0f01":10,"0x07":10,"0x0e":10,"0x0f01":10,"0xb":10,"0xe":10,"600px":[],"abstract":[5,6,7],"boolean":4,"class":[4,5,6,7,8,9,10],"const":7,"default":[5,6,7],"enum":4,"final":4,"float":10,"function":[4,7,10,11],"import":11,"new":[4,11,12],"return":[2,3,4,5,6,7,9,10],"static":2,"true":[4,10],"try":11,"var":6,For:9,HLS:[4,12],IPs:8,PEs:6,The:[2,4,7,8,9,10,11,12],There:11,Use:10,abc:[5,7],abit:10,about:[2,8,12],abov:11,absorb1bitmulintomatmul:9,absorb:[1,7,8],absorbaddintomultithreshold:9,absorbmulintomultithreshold:9,acceler:[8,11],account:4,action:8,activ:4,add:[7,9],adding:11,addit:11,addition:9,address:8,after:10,aim:9,align:[],all:[2,4,5,6,7,8,10,11],all_tensors_f32:2,allow:4,alreadi:8,also:[5,6,8],amount:10,analysi:[1,4],analysis_fxn:4,anaylsis_fxn:4,ani:[4,7,8,10,11],annot:[2,5,6],anoth:8,append_includ:10,append_sourc:10,append_tcl:10,appli:[4,7,8,9],apply_rep:7,appropri:[7,11],arbitrari:10,architectur:12,argument:11,around:4,arrai:10,array2hexstr:10,arxiv:9,assign:4,associ:[4,7],assum:10,attribut:[2,5,6,8],attribute_nam:[5,6],attributeproto:[5,6],back:11,backend:8,base:[4,5,6,7,8,9,10],basic:1,batchnorm:7,batchnorm_to_affin:1,batchnormtoaffin:7,been:8,befor:10,between:[6,10],binari:[4,6,8,9,10],bipolar:[4,6,7,9,10],bipolar_to_xnor:1,bit:[4,10],bitfil:11,bitwidth:4,blackboxfunct:6,block:8,blott:6,board:8,bool:[2,7],both:10,bram_estim:6,brevita:12,brien:6,browser:11,build:10,built:2,calc_tmem:6,calc_wmem:6,calcul:6,calculate_signed_dot_prod_rang:10,call:[4,6,7,8,11],can:[4,7,8,9,10,11,12],cannot:7,center:[],centerpiec:12,certain:2,chang:[4,7,11],check:[2,4,5,6],check_all_tensor_shapes_specifi:4,check_compat:4,cleanup:[1,7],clk:[6,8],clone:[10,11],code:[8,10],code_gen_dir:10,code_generation_ipgen:6,code_generation_npysim:6,codegen_ipgen:[1,7],codegen_ipstitch:[1,7],codegen_npysim:[1,7],collaps:9,collapse_rep:[1,7],collapserepeatedadd:9,collapserepeatedmul:9,collapserepeatedop:9,collect:[8,11],colloqui:12,come:[2,11],command:11,commun:12,compar:[4,5],compare_execut:4,compare_fxn:4,compat:[4,5,6],compil:[1,7,12],compile_singlenode_cod:6,complet:11,compon:12,comput:[4,11],consecut:9,constant:[2,4,9],construct:12,consum:4,contain:[4,5,8,10,11,12],content:[],context:[4,5,6],contribut:12,convent:2,convert:[6,7,8,9,10,11],convert_to_hls_lay:[1,7],convertbipolarmatmultoxnorpopcount:7,convertsigntothr:9,convertsubtoadd:7,convolutioninputgener:[1,5],copi:[4,7,8],core:1,corner:12,correct:7,correctli:[2,5,6,8,11],correspond:[4,5,6,12],count:6,cpp_file:10,cppbuilder:10,creat:[4,8,10,11],create_dataflow_partit:[1,7],createdataflowpartit:8,current:[4,12],custom:[2,4,11,12],custom_op:1,customop:[5,6],data:[5,8,10],data_pack:1,dataflow:[4,8,12],dataoutstrm:6,datatyp:[1,5,6,7,10],debug:4,declar:7,deep:[4,6,7,12],default_v:[5,6],default_valu:[5,6],defin:6,depend:11,deploi:11,deploy:8,deploytopynq:8,design:[8,11],detail:12,develop:12,dict:[4,5,6],dictionari:[2,4],differ:11,digit:10,dimens:10,dimension:10,dir:[8,10],directori:[8,10,11],distr_pad:10,divis:10,dnn:[],doc:12,docker:10,dockerfil:11,docomput:6,doe:11,don:7,done:2,dot:10,down:11,driver:8,dt_a:10,dt_b:10,dtype:[2,4,5,6,10],dynam:2,dynamic_input_to_npi:6,each:[2,4,7,9,10,12],editor:11,effect:7,either:11,element:10,embed:4,emit:10,emphasi:12,empti:4,end:6,ensur:[6,7,8,10],entir:11,enumer:[4,7],environ:11,equal:[5,6],equival:9,estim:3,even:7,evenli:10,everi:7,everyth:11,exampl:[10,11],excel:11,exec_precompiled_singlenode_model:6,execut:[4,5,6],execute_custom_nod:1,execute_nod:[4,5,6],execute_onnx:4,execute_onnx_and_make_model:4,exist:[5,10],exit:10,expect:[2,4,5,6,8],experi:12,experiment:12,explor:[4,6,12],expos:4,extens:11,extra:[2,10,11],extract:[2,3],f5c6bd32ae93ec103a88152214baedff4ce1850d81065bfc:11,factor:10,factoroutmulsignmagnitud:9,fals:[4,7,10],familiar:11,fan:2,fast:6,fewest:4,field:[8,10],file:[4,8,10,11],filenam:[4,8],find:4,find_consum:4,find_produc:4,finn:[],finn_dt:10,finnpy_to_packed_bytearrai:10,first:[2,9],fix:[7,10],flatten:10,float32:[2,4],flow:[],fold_const:1,foldconst:7,folder:[8,10,11],follow:[2,8,11,12],form:6,forward:11,found:[8,12],four:10,fpga:[11,12],fpgadataflow:[1,2,5,7],fpgapart:[6,8],framework:[6,12],fraser:6,from:[3,4,8,10,11,12],full:4,further:7,gambardella:6,gen_finn_dt_tensor:10,gener:[1,8,10,12],generate_param:6,get:[4,5],get_all_tensor_nam:4,get_by_nam:10,get_finn_root:10,get_folded_input_shap:6,get_folded_output_shap:6,get_hls_compatible_threshold_tensor:6,get_hls_compatible_weight_tensor:6,get_hls_datatype_str:4,get_initi:4,get_input_datatyp:6,get_instream_width:6,get_metadata_prop:4,get_nodeattr:5,get_nodeattr_typ:[5,6],get_num_possible_valu:4,get_number_output_valu:6,get_output_datatyp:6,get_outstream_width:6,get_per_tensor_fanout:2,get_smallest_poss:4,get_stream_width:6,get_template_param_valu:6,get_tensor_datatyp:4,get_tensor_fanout:4,get_tensor_shap:4,get_tensor_valueinfo:4,get_test_model_def_fxn:10,get_test_model_train:10,get_test_model_untrain:10,get_trained_checkpoint:10,get_weight_datatyp:6,getcustomop:5,github:12,give:[7,9,11],give_unique_node_nam:7,given:[2,3,4,5,6,10],giverandomtensornam:7,givereadabletensornam:7,giveuniquenodenam:7,global_includ:6,graph:[2,4,5,6,7,8],graphic:12,guarante:7,guid:1,hand:12,has:[2,4,7,8,10],have:[2,4,7,8,9,11],height:[],help:11,hex:10,hexstr:10,hexstring2npbytearrai:10,high:11,highli:12,hls_synth_res_estim:[1,2],hls_var_nam:10,hlscustomop:6,hlslib:[6,12],hlssynth_ipgen:[1,7],homepag:12,host:[10,11],how:[1,10],http:11,human:7,imag:[],img:[],immedi:8,implement:4,includ:[4,8,12],index:[],indic:[4,5,6,7,8],infer:[4,5,6,7,10,11,12],infer_datatyp:1,infer_node_datatyp:[5,6],infer_shap:1,inferbinarystreamingfclay:8,inferdatatyp:7,infershap:7,infinit:7,info:[7,10],info_messag:2,inform:[2,8],infrastructur:8,inherit:7,initi:[2,4],innermost:10,inp0:5,inp1:5,inp:6,input:[2,4,5,6,7,9,10],input_dict:4,input_dtyp:10,input_fil:10,insert:[8,10],insert_tlastmark:[1,7],inserttlastmark:8,insid:[5,11],instal:11,instanc:[4,5,6,9],instanti:8,instead:10,int16:4,int2:4,int32:4,int3:4,int4:4,int8:4,integ:[4,9,10],intend:[],interfac:8,interleav:6,interleave_matrix_outer_dim_from_partit:10,intermedi:[4,7],intern:7,involv:11,ipgen_singlenode_cod:6,ipgenbuild:10,is_integ:4,is_linear:2,item:10,jupyt:12,kei:4,know:7,lab:12,lambda:4,largest:4,launch:11,layer:[7,8],lead:10,learn:[6,12],leeser:6,len:10,let:7,letter:10,librari:12,library_path:10,like:11,linear:[2,4],link:[11,12],list:[2,4],locat:11,look:[2,11],loop:7,lut_estim:6,made:[4,7],magnitud:9,mai:11,make:[7,8,11],make_build_dir:10,make_collapsed_param_fxn:9,make_deepcopi:4,make_deploy:[1,7],make_empty_exec_context:4,make_new_valueinfo_nam:4,make_project:8,make_pynq_driv:[1,7],make_pynq_proj:[1,7],make_shape_compatible_op:[5,6],makepynqdriv:8,makepynqproject:8,mani:11,manipul:4,manual:7,matmul:[7,9],matrix:[6,9,10],max:[4,10],mean:10,meant:7,member:[5,6],metadata_prop:[4,8],min:[4,10],minimum:10,mixtur:2,mkdtemp:10,mode:11,model:[2,3,4,5,6,7,8,9,10],model_a:4,model_b:4,model_was_chang:7,modelproto:[4,8],modelwrapp:[1,2,7],modul:[],modular:12,more:[4,7,10,12],mount:11,move:9,moveaddpastmul:9,movescalaraddpastmatmul:9,movescalarmulpastmatmul:9,mul:[7,9],multidimension:10,multipl:[7,9,10],multipli:9,multithreshold:[1,8,9],must:[5,7,8,9,10],mvtu:8,n_partit:10,n_thres_step:6,name:[2,3,4,5,7,10],name_field:10,ndarrai:10,nearest:[9,10],necessari:8,need:[3,5,6,7],neg:[4,9],netnam:10,netron:11,network:[6,11,12],neural:[6,12],new_nam:4,next:9,no_decl:10,node:[2,3,4,5,6,7,8,9],node_inputs_in_expected_ord:2,node_res_estim:6,non:8,none:[4,5,10],note:11,notebook:12,notwithstand:2,now:[2,4],npbytearrai:10,npbytearray2hexstr:10,npy:10,npy_to_dynamic_output:6,npy_to_rtlsim_input:10,number:[4,5,6,10],numpi:[6,10],numpy_to_hls_cod:10,object:[4,10],old_nam:4,onc:7,one:[2,4,8,10],ones:11,onli:[2,4,7,8,9],onlin:11,onnx:[1,4,5,6,8],onnx_exec:1,onnx_model_proto:4,onnx_nod:[5,6],onnxruntim:4,op_nam:9,op_typ:2,open:11,oper:[4,9],ops:[2,9],option:11,order:2,orig_thres_matrix:6,orig_weight_matrix:6,origin:6,other:[4,9],otherwis:[4,7,10,11],out:2,out_bia:5,out_scal:5,out_shap:10,outcom:8,output:[4,5,6,7,10],output_shap:10,overlai:8,overview:12,own:11,pack:[8,10],pack_innermost_dim:10,pack_innermost_dim_as_hex_str:10,packag:[],packed_bytearrai:10,packed_bytearray_to_finnpi:10,packedbit:10,pad:10,pad_tensor_to_multiple_of:10,pad_to_dim:10,pad_to_nbit:10,page:[],pair:8,paramet:9,part:[5,10],particular:[5,6,10],partit:4,pass:[1,6],password:8,past:9,path:[6,10],per:8,perform:[5,6,11],permit:[5,6],place:8,platform:8,png:[],point:[7,11],port:11,posit:[6,9,10],possibl:[4,8],pragma:6,preced:9,precid:9,precis:10,precomput:7,prefer:4,prefix:10,prepend:10,preusser:6,previous:8,print:11,prior:[7,8,10],process:11,produc:[2,4],product:10,project:[8,12],properti:[2,4],provid:[4,11],pushbutton:11,pynq:8,pynq_driver_dir:8,python:[8,10,11],pyveril:10,pyverilate_stitched_ip:10,qnn:[11,12],quantiz:[2,6,12],random:[7,10],random_str:10,randomli:10,rather:11,reach:7,read:12,read_npy_data:6,readabl:7,readthedoc:[],recommend:7,refer:12,reflect:11,registri:1,relat:12,remot:4,remov:[8,10],remove_by_nam:10,remove_prefix:10,renam:4,rename_tensor:4,reorder:[1,7],repeat:[7,9],repeatedli:4,replac:7,repo:11,repositori:[11,12],repositroi:[],repres:[4,10],represent:10,requir:[4,5,6],res_estim:[1,2],research:12,reset_rtlsim:6,reshap:6,resourc:[3,11],respect:10,result:[2,3,4,7,8,9,10],return_full_exec_context:4,returned_dict:[5,6],revers:10,reverse_endian:10,reverse_inn:10,right:12,root:[10,11],round:[9,10],round_threshold:[1,7],roundandclipthreshold:9,roundup_to_integer_multipl:10,row:6,rtlsim:[4,6],rtlsim_output_to_npi:10,run:[4,8],run_dock:11,same:[8,10],save:[4,10],save_as_npi:6,scalar:9,scale:[],scp:8,script:[8,11],search:[],second:[8,9],see:[9,10],seen:12,sep:6,separ:12,sequenc:10,server:11,set:[4,5,6,8,9,10,11],set_attribut:[],set_executable_path:10,set_initi:4,set_ipgen_path:10,set_metadata_prop:4,set_nodeattr:5,set_sim_mod:[1,7],set_tensor_datatyp:4,set_tensor_shap:4,setsimmod:[],settings64:11,sever:11,shape:[4,5,6,7,10],shell:8,should:[2,4,7,11],sign:[4,7,9,10],sign_to_thr:[1,7],sim:[6,10],sim_mod:[],simd:6,simpli:11,sinc:[4,10],singl:[4,9,10,11],small:2,smallest:4,some:[4,7,11,12],someth:11,space:[],spawn:11,specif:12,specifi:[4,7,10],split:[8,9,10],stai:12,standard:[4,5,6],stitch:[8,10],store:[5,8,10],streamingdataflowpartit:[1,8],streamingfclayer_batch:[1,5,8],streamingmaxpool_batch:[1,5],streamlin:[1,7],string:[2,10],stringlength:10,strm_decl:6,structur:2,style:12,sub:7,subdirectori:8,subgraph:4,submodul:1,subpackag:[],subset:2,success:8,suitabl:6,sure:11,surviv:10,synth_pynq_proj:[1,7],synthesi:[3,8],synthpynqproject:8,take:[2,4,7,9,10,11],taken:[4,8,12],target:[8,12],target_dir:8,targetbit:10,tcl:8,tcl_script:10,tempfil:10,templat:[1,5,7],temporari:10,tensor:[2,4,7,9,10],tensor_fanout:2,tensor_nam:[2,4],tensor_shap:[4,10],tensor_valu:4,termin:[8,11],ternari:4,test:[1,7],text:11,thei:9,them:[2,8,9],thi:[2,4,5,6,7,8,10,11,12],thing:12,thought:11,threshold:[5,6,9],time:[7,11],tlastmark:[1,5,8],tmem:6,togeth:8,toggle_clk:6,token:11,tool:[11,12],topolog:1,train:[11,12],transform:[1,4],transformed_model:7,travers:2,tune:12,tupl:7,two:[4,8,9,10,12],type:[4,7,10],ubuntu:11,uint16:4,uint2:[4,10],uint32:4,uint3:4,uint4:4,uint8:[4,10],umuroglu:6,under:[8,12],uniqu:7,unpack:[8,10],unpack_innermost_dim_from_hex_str:10,unsign:[4,9],until:4,updat:[9,12],upper:12,use:12,used:[4,5,6,10,12],useful:4,user:7,usernam:8,using:[4,7,9,10,12],util:[1,4,5,6],val:10,valu:[4,5,6,8,9,10],value_info:4,valueinfo:[4,7],valueinfo_to_tensor:10,valueinfoproto:[4,10],variabl:[10,11],vector:[9,10],verif:2,verifi:[2,5,6],verify_custom_nod:1,verify_nod:[2,5,6],version:12,via:4,view:12,visser:6,vivado:[3,4,8,11,12],vivado_path:11,vivado_pynq_proj:8,vivado_stitch_proj:8,wai:[2,11],want:9,wbit:10,websit:12,weight:[4,6],welcom:12,well:11,when:[2,7],where:[4,5,6,8,9,11],whether:[2,4,5,6,7],which:[4,5,6,8,9,10,11,12],width:10,without:11,wmem:6,work:[4,10,11],workspac:11,wrapper:4,write:[1,11],xdnn:[],xilinx:12,xnorpopcount:1,xnorpopcountmatmul:[5,7,8],you:[7,11],your:[7,11],zero:[4,9,10]},titles:["FINN - End-to-End Flow","finn package","finn.analysis package","finn.analysis.fpgadataflow package","finn.core package","finn.custom_op package","finn.custom_op.fpgadataflow package","finn.transformation package","finn.transformation.fpgadataflow package","finn.transformation.streamline package","finn.util package","Getting Started","FINN","src","Source Code"],titleterms:{absorb:9,analysi:[2,3],basic:10,batchnorm_to_affin:7,bipolar_to_xnor:7,cleanup:8,code:14,codegen_ipgen:8,codegen_ipstitch:8,codegen_npysim:8,collapse_rep:9,compil:[8,11],content:[1,2,3,4,5,6,7,8,9,10],convert_to_hls_lay:8,convolutioninputgener:6,core:4,create_dataflow_partit:8,custom_op:[5,6],data_pack:10,datatyp:4,develop:11,directli:11,docker:11,document:[],end:0,execute_custom_nod:4,experiment:11,finn:[0,1,2,3,4,5,6,7,8,9,10,11,12],flow:0,fold_const:7,fpgadataflow:[3,6,8,10],gener:7,get:11,guid:7,hls_synth_res_estim:3,hlssynth_ipgen:8,how:[2,11],indic:[],infer_datatyp:7,infer_shap:7,insert_tlastmark:8,interact:11,jenkin:11,jupyt:11,make_deploy:8,make_pynq_driv:8,make_pynq_proj:8,modelwrapp:4,modul:[1,2,3,4,5,6,7,8,9,10],multithreshold:5,notebook:11,onnx:10,onnx_exec:4,packag:[1,2,3,4,5,6,7,8,9,10],pass:2,registri:5,reorder:9,requir:11,res_estim:3,round_threshold:9,run:11,set_sim_mod:8,shell:11,sign_to_thr:9,sourc:14,src:13,start:11,streamingdataflowpartit:5,streamingfclayer_batch:6,streamingmaxpool_batch:6,streamlin:9,submodul:[2,3,4,5,6,7,8,9,10],subpackag:[1,2,5,7],suit:11,synth_pynq_proj:8,tabl:[],templat:[6,8],test:[10,11],tlastmark:6,topolog:2,transform:[7,8,9],use:11,using:11,util:10,verify_custom_nod:2,welcom:[],what:12,write:[2,7],xnorpopcount:5}})