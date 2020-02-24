Search.setIndex({docnames:["end_to_end_flow","getting_started","index","modules","source_code","source_code/finn","source_code/finn.analysis","source_code/finn.analysis.fpgadataflow","source_code/finn.core","source_code/finn.custom_op","source_code/finn.custom_op.fpgadataflow","source_code/finn.transformation","source_code/finn.transformation.fpgadataflow","source_code/finn.transformation.streamline","source_code/finn.util","source_code/modules"],envversion:{"sphinx.domains.c":1,"sphinx.domains.changeset":1,"sphinx.domains.citation":1,"sphinx.domains.cpp":1,"sphinx.domains.javascript":1,"sphinx.domains.math":2,"sphinx.domains.python":1,"sphinx.domains.rst":1,"sphinx.domains.std":1,sphinx:56},filenames:["end_to_end_flow.rst","getting_started.rst","index.rst","modules.rst","source_code.rst","source_code/finn.rst","source_code/finn.analysis.rst","source_code/finn.analysis.fpgadataflow.rst","source_code/finn.core.rst","source_code/finn.custom_op.rst","source_code/finn.custom_op.fpgadataflow.rst","source_code/finn.transformation.rst","source_code/finn.transformation.fpgadataflow.rst","source_code/finn.transformation.streamline.rst","source_code/finn.util.rst","source_code/modules.rst"],objects:{"":{finn:[5,0,0,"-"]},"finn.analysis":{fpgadataflow:[7,0,0,"-"],topology:[6,0,0,"-"],verify_custom_nodes:[6,0,0,"-"]},"finn.analysis.fpgadataflow":{hls_synth_res_estimation:[7,0,0,"-"],res_estimation:[7,0,0,"-"]},"finn.analysis.fpgadataflow.hls_synth_res_estimation":{hls_synth_res_estimation:[7,1,1,""]},"finn.analysis.fpgadataflow.res_estimation":{res_estimation:[7,1,1,""]},"finn.analysis.topology":{all_tensors_f32:[6,1,1,""],get_per_tensor_fanouts:[6,1,1,""],is_linear:[6,1,1,""],node_inputs_in_expected_order:[6,1,1,""]},"finn.analysis.verify_custom_nodes":{verify_nodes:[6,1,1,""]},"finn.core":{datatype:[8,0,0,"-"],execute_custom_node:[8,0,0,"-"],modelwrapper:[8,0,0,"-"],onnx_exec:[8,0,0,"-"],remote_exec:[8,0,0,"-"],rtlsim_exec:[8,0,0,"-"]},"finn.core.datatype":{DataType:[8,2,1,""]},"finn.core.datatype.DataType":{BINARY:[8,3,1,""],BIPOLAR:[8,3,1,""],FLOAT32:[8,3,1,""],INT16:[8,3,1,""],INT2:[8,3,1,""],INT32:[8,3,1,""],INT3:[8,3,1,""],INT4:[8,3,1,""],INT8:[8,3,1,""],TERNARY:[8,3,1,""],UINT16:[8,3,1,""],UINT2:[8,3,1,""],UINT32:[8,3,1,""],UINT3:[8,3,1,""],UINT4:[8,3,1,""],UINT8:[8,3,1,""],allowed:[8,4,1,""],bitwidth:[8,4,1,""],get_hls_datatype_str:[8,4,1,""],get_num_possible_values:[8,4,1,""],get_smallest_possible:[8,4,1,""],is_integer:[8,4,1,""],max:[8,4,1,""],min:[8,4,1,""],signed:[8,4,1,""]},"finn.core.execute_custom_node":{execute_custom_node:[8,1,1,""]},"finn.core.modelwrapper":{ModelWrapper:[8,2,1,""]},"finn.core.modelwrapper.ModelWrapper":{analysis:[8,4,1,""],check_all_tensor_shapes_specified:[8,4,1,""],check_compatibility:[8,4,1,""],find_consumer:[8,4,1,""],find_producer:[8,4,1,""],get_all_tensor_names:[8,4,1,""],get_initializer:[8,4,1,""],get_metadata_prop:[8,4,1,""],get_tensor_datatype:[8,4,1,""],get_tensor_fanout:[8,4,1,""],get_tensor_shape:[8,4,1,""],get_tensor_valueinfo:[8,4,1,""],graph:[8,4,1,""],make_empty_exec_context:[8,4,1,""],make_new_valueinfo_name:[8,4,1,""],model:[8,4,1,""],rename_tensor:[8,4,1,""],save:[8,4,1,""],set_initializer:[8,4,1,""],set_metadata_prop:[8,4,1,""],set_tensor_datatype:[8,4,1,""],set_tensor_shape:[8,4,1,""],transform:[8,4,1,""]},"finn.core.onnx_exec":{compare_execution:[8,1,1,""],execute_node:[8,1,1,""],execute_onnx:[8,1,1,""],execute_onnx_and_make_model:[8,1,1,""]},"finn.core.remote_exec":{remote_exec:[8,1,1,""]},"finn.core.rtlsim_exec":{rtlsim_exec:[8,1,1,""]},"finn.custom_op":{CustomOp:[9,2,1,""],fpgadataflow:[10,0,0,"-"],multithreshold:[9,0,0,"-"],registry:[9,0,0,"-"],streamingdataflowpartition:[9,0,0,"-"],xnorpopcount:[9,0,0,"-"]},"finn.custom_op.CustomOp":{execute_node:[9,4,1,""],get_nodeattr:[9,4,1,""],get_nodeattr_types:[9,4,1,""],infer_node_datatype:[9,4,1,""],make_shape_compatible_op:[9,4,1,""],set_nodeattr:[9,4,1,""],verify_node:[9,4,1,""]},"finn.custom_op.fpgadataflow":{HLSCustomOp:[10,2,1,""],convolutioninputgenerator:[10,0,0,"-"],streamingfclayer_batch:[10,0,0,"-"],streamingmaxpool_batch:[10,0,0,"-"],templates:[10,0,0,"-"],tlastmarker:[10,0,0,"-"]},"finn.custom_op.fpgadataflow.HLSCustomOp":{blackboxfunction:[10,4,1,""],bram_estimation:[10,4,1,""],code_generation_ipgen:[10,4,1,""],code_generation_npysim:[10,4,1,""],compile_singlenode_code:[10,4,1,""],dataoutstrm:[10,4,1,""],defines:[10,4,1,""],docompute:[10,4,1,""],dynamic_input_to_npy:[10,4,1,""],exec_precompiled_singlenode_model:[10,4,1,""],execute_node:[10,4,1,""],generate_params:[10,4,1,""],get_folded_input_shape:[10,4,1,""],get_folded_output_shape:[10,4,1,""],get_instream_width:[10,4,1,""],get_nodeattr_types:[10,4,1,""],get_number_output_values:[10,4,1,""],get_outstream_width:[10,4,1,""],global_includes:[10,4,1,""],ipgen_singlenode_code:[10,4,1,""],lut_estimation:[10,4,1,""],node_res_estimation:[10,4,1,""],npy_to_dynamic_output:[10,4,1,""],pragmas:[10,4,1,""],read_npy_data:[10,4,1,""],reset_rtlsim:[10,4,1,""],rtlsim:[10,4,1,""],save_as_npy:[10,4,1,""],strm_decl:[10,4,1,""],toggle_clk:[10,4,1,""]},"finn.custom_op.fpgadataflow.convolutioninputgenerator":{ConvolutionInputGenerator:[10,2,1,""]},"finn.custom_op.fpgadataflow.convolutioninputgenerator.ConvolutionInputGenerator":{blackboxfunction:[10,4,1,""],bram_estimation:[10,4,1,""],dataoutstrm:[10,4,1,""],defines:[10,4,1,""],docompute:[10,4,1,""],execute_node:[10,4,1,""],get_input_datatype:[10,4,1,""],get_nodeattr_types:[10,4,1,""],get_number_output_values:[10,4,1,""],get_output_datatype:[10,4,1,""],get_stream_width:[10,4,1,""],global_includes:[10,4,1,""],infer_node_datatype:[10,4,1,""],lut_estimation:[10,4,1,""],make_shape_compatible_op:[10,4,1,""],pragmas:[10,4,1,""],read_npy_data:[10,4,1,""],save_as_npy:[10,4,1,""],strm_decl:[10,4,1,""],verify_node:[10,4,1,""]},"finn.custom_op.fpgadataflow.streamingfclayer_batch":{StreamingFCLayer_Batch:[10,2,1,""]},"finn.custom_op.fpgadataflow.streamingfclayer_batch.StreamingFCLayer_Batch":{blackboxfunction:[10,4,1,""],bram_estimation:[10,4,1,""],calc_tmem:[10,4,1,""],calc_wmem:[10,4,1,""],dataoutstrm:[10,4,1,""],defines:[10,4,1,""],docompute:[10,4,1,""],execute_node:[10,4,1,""],generate_params:[10,4,1,""],get_folded_input_shape:[10,4,1,""],get_folded_output_shape:[10,4,1,""],get_hls_compatible_threshold_tensor:[10,4,1,""],get_hls_compatible_weight_tensor:[10,4,1,""],get_input_datatype:[10,4,1,""],get_instream_width:[10,4,1,""],get_nodeattr_types:[10,4,1,""],get_number_output_values:[10,4,1,""],get_output_datatype:[10,4,1,""],get_outstream_width:[10,4,1,""],get_template_param_values:[10,4,1,""],get_weight_datatype:[10,4,1,""],global_includes:[10,4,1,""],infer_node_datatype:[10,4,1,""],lut_estimation:[10,4,1,""],make_shape_compatible_op:[10,4,1,""],pragmas:[10,4,1,""],read_npy_data:[10,4,1,""],save_as_npy:[10,4,1,""],strm_decl:[10,4,1,""],verify_node:[10,4,1,""]},"finn.custom_op.fpgadataflow.streamingmaxpool_batch":{StreamingMaxPool_Batch:[10,2,1,""]},"finn.custom_op.fpgadataflow.streamingmaxpool_batch.StreamingMaxPool_Batch":{blackboxfunction:[10,4,1,""],bram_estimation:[10,4,1,""],dataoutstrm:[10,4,1,""],defines:[10,4,1,""],docompute:[10,4,1,""],get_nodeattr_types:[10,4,1,""],get_number_output_values:[10,4,1,""],global_includes:[10,4,1,""],infer_node_datatype:[10,4,1,""],lut_estimation:[10,4,1,""],make_shape_compatible_op:[10,4,1,""],pragmas:[10,4,1,""],read_npy_data:[10,4,1,""],save_as_npy:[10,4,1,""],strm_decl:[10,4,1,""],verify_node:[10,4,1,""]},"finn.custom_op.fpgadataflow.tlastmarker":{TLastMarker:[10,2,1,""]},"finn.custom_op.fpgadataflow.tlastmarker.TLastMarker":{blackboxfunction:[10,4,1,""],dataoutstrm:[10,4,1,""],defines:[10,4,1,""],docompute:[10,4,1,""],execute_node:[10,4,1,""],get_folded_input_shape:[10,4,1,""],get_folded_output_shape:[10,4,1,""],get_instream_width:[10,4,1,""],get_nodeattr_types:[10,4,1,""],get_number_output_values:[10,4,1,""],get_outstream_width:[10,4,1,""],global_includes:[10,4,1,""],infer_node_datatype:[10,4,1,""],make_shape_compatible_op:[10,4,1,""],pragmas:[10,4,1,""],read_npy_data:[10,4,1,""],save_as_npy:[10,4,1,""],strm_decl:[10,4,1,""],verify_node:[10,4,1,""]},"finn.custom_op.multithreshold":{MultiThreshold:[9,2,1,""],compare:[9,1,1,""],multithreshold:[9,1,1,""]},"finn.custom_op.multithreshold.MultiThreshold":{execute_node:[9,4,1,""],get_nodeattr_types:[9,4,1,""],infer_node_datatype:[9,4,1,""],make_shape_compatible_op:[9,4,1,""],verify_node:[9,4,1,""]},"finn.custom_op.registry":{getCustomOp:[9,1,1,""]},"finn.custom_op.streamingdataflowpartition":{StreamingDataflowPartition:[9,2,1,""]},"finn.custom_op.streamingdataflowpartition.StreamingDataflowPartition":{execute_node:[9,4,1,""],get_nodeattr_types:[9,4,1,""],infer_node_datatype:[9,4,1,""],make_shape_compatible_op:[9,4,1,""],verify_node:[9,4,1,""]},"finn.custom_op.xnorpopcount":{XnorPopcountMatMul:[9,2,1,""],xnorpopcountmatmul:[9,1,1,""]},"finn.custom_op.xnorpopcount.XnorPopcountMatMul":{execute_node:[9,4,1,""],get_nodeattr_types:[9,4,1,""],infer_node_datatype:[9,4,1,""],make_shape_compatible_op:[9,4,1,""],verify_node:[9,4,1,""]},"finn.transformation":{Transformation:[11,2,1,""],batchnorm_to_affine:[11,0,0,"-"],bipolar_to_xnor:[11,0,0,"-"],fold_constants:[11,0,0,"-"],fpgadataflow:[12,0,0,"-"],general:[11,0,0,"-"],infer_datatypes:[11,0,0,"-"],infer_shapes:[11,0,0,"-"],streamline:[13,0,0,"-"]},"finn.transformation.Transformation":{apply:[11,4,1,""]},"finn.transformation.batchnorm_to_affine":{BatchNormToAffine:[11,2,1,""]},"finn.transformation.batchnorm_to_affine.BatchNormToAffine":{apply:[11,4,1,""]},"finn.transformation.bipolar_to_xnor":{ConvertBipolarMatMulToXnorPopcount:[11,2,1,""]},"finn.transformation.bipolar_to_xnor.ConvertBipolarMatMulToXnorPopcount":{apply:[11,4,1,""]},"finn.transformation.fold_constants":{FoldConstants:[11,2,1,""]},"finn.transformation.fold_constants.FoldConstants":{apply:[11,4,1,""]},"finn.transformation.fpgadataflow":{cleanup:[12,0,0,"-"],codegen_ipgen:[12,0,0,"-"],codegen_ipstitch:[12,0,0,"-"],codegen_npysim:[12,0,0,"-"],compile:[12,0,0,"-"],convert_to_hls_layers:[12,0,0,"-"],create_dataflow_partition:[12,0,0,"-"],hlssynth_ipgen:[12,0,0,"-"],insert_tlastmarker:[12,0,0,"-"],make_deployment:[12,0,0,"-"],make_pynq_driver:[12,0,0,"-"],make_pynq_proj:[12,0,0,"-"],set_exec_mode:[12,0,0,"-"],synth_pynq_proj:[12,0,0,"-"],templates:[12,0,0,"-"]},"finn.transformation.fpgadataflow.cleanup":{CleanUp:[12,2,1,""]},"finn.transformation.fpgadataflow.cleanup.CleanUp":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.codegen_ipgen":{CodeGen_ipgen:[12,2,1,""]},"finn.transformation.fpgadataflow.codegen_ipgen.CodeGen_ipgen":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.codegen_ipstitch":{CodeGen_ipstitch:[12,2,1,""]},"finn.transformation.fpgadataflow.codegen_ipstitch.CodeGen_ipstitch":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.codegen_npysim":{CodeGen_npysim:[12,2,1,""]},"finn.transformation.fpgadataflow.codegen_npysim.CodeGen_npysim":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.compile":{Compile:[12,2,1,""]},"finn.transformation.fpgadataflow.compile.Compile":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.convert_to_hls_layers":{InferBinaryStreamingFCLayer:[12,2,1,""]},"finn.transformation.fpgadataflow.convert_to_hls_layers.InferBinaryStreamingFCLayer":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.create_dataflow_partition":{CreateDataflowPartition:[12,2,1,""]},"finn.transformation.fpgadataflow.create_dataflow_partition.CreateDataflowPartition":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.hlssynth_ipgen":{HLSSynth_IPGen:[12,2,1,""]},"finn.transformation.fpgadataflow.hlssynth_ipgen.HLSSynth_IPGen":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.insert_tlastmarker":{InsertTLastMarker:[12,2,1,""]},"finn.transformation.fpgadataflow.insert_tlastmarker.InsertTLastMarker":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.make_deployment":{DeployToPYNQ:[12,2,1,""]},"finn.transformation.fpgadataflow.make_deployment.DeployToPYNQ":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.make_pynq_driver":{MakePYNQDriver:[12,2,1,""]},"finn.transformation.fpgadataflow.make_pynq_driver.MakePYNQDriver":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.make_pynq_proj":{MakePYNQProject:[12,2,1,""]},"finn.transformation.fpgadataflow.make_pynq_proj.MakePYNQProject":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.set_exec_mode":{SetExecMode:[12,2,1,""]},"finn.transformation.fpgadataflow.set_exec_mode.SetExecMode":{apply:[12,4,1,""]},"finn.transformation.fpgadataflow.synth_pynq_proj":{SynthPYNQProject:[12,2,1,""]},"finn.transformation.fpgadataflow.synth_pynq_proj.SynthPYNQProject":{apply:[12,4,1,""]},"finn.transformation.general":{ConvertSubToAdd:[11,2,1,""],GiveRandomTensorNames:[11,2,1,""],GiveReadableTensorNames:[11,2,1,""],GiveUniqueNodeNames:[11,2,1,""]},"finn.transformation.general.ConvertSubToAdd":{apply:[11,4,1,""]},"finn.transformation.general.GiveRandomTensorNames":{apply:[11,4,1,""]},"finn.transformation.general.GiveReadableTensorNames":{apply:[11,4,1,""]},"finn.transformation.general.GiveUniqueNodeNames":{apply:[11,4,1,""]},"finn.transformation.infer_datatypes":{InferDataTypes:[11,2,1,""]},"finn.transformation.infer_datatypes.InferDataTypes":{apply:[11,4,1,""]},"finn.transformation.infer_shapes":{InferShapes:[11,2,1,""]},"finn.transformation.infer_shapes.InferShapes":{apply:[11,4,1,""]},"finn.transformation.streamline":{Streamline:[13,2,1,""],absorb:[13,0,0,"-"],collapse_repeated:[13,0,0,"-"],reorder:[13,0,0,"-"],round_thresholds:[13,0,0,"-"],sign_to_thres:[13,0,0,"-"]},"finn.transformation.streamline.Streamline":{apply:[13,4,1,""]},"finn.transformation.streamline.absorb":{Absorb1BitMulIntoMatMul:[13,2,1,""],AbsorbAddIntoMultiThreshold:[13,2,1,""],AbsorbMulIntoMultiThreshold:[13,2,1,""],FactorOutMulSignMagnitude:[13,2,1,""]},"finn.transformation.streamline.absorb.Absorb1BitMulIntoMatMul":{apply:[13,4,1,""]},"finn.transformation.streamline.absorb.AbsorbAddIntoMultiThreshold":{apply:[13,4,1,""]},"finn.transformation.streamline.absorb.AbsorbMulIntoMultiThreshold":{apply:[13,4,1,""]},"finn.transformation.streamline.absorb.FactorOutMulSignMagnitude":{apply:[13,4,1,""]},"finn.transformation.streamline.collapse_repeated":{CollapseRepeatedAdd:[13,2,1,""],CollapseRepeatedMul:[13,2,1,""],CollapseRepeatedOp:[13,2,1,""]},"finn.transformation.streamline.collapse_repeated.CollapseRepeatedOp":{apply:[13,4,1,""]},"finn.transformation.streamline.reorder":{MoveAddPastMul:[13,2,1,""],MoveScalarAddPastMatMul:[13,2,1,""],MoveScalarMulPastMatMul:[13,2,1,""]},"finn.transformation.streamline.reorder.MoveAddPastMul":{apply:[13,4,1,""]},"finn.transformation.streamline.reorder.MoveScalarAddPastMatMul":{apply:[13,4,1,""]},"finn.transformation.streamline.reorder.MoveScalarMulPastMatMul":{apply:[13,4,1,""]},"finn.transformation.streamline.round_thresholds":{RoundAndClipThresholds:[13,2,1,""]},"finn.transformation.streamline.round_thresholds.RoundAndClipThresholds":{apply:[13,4,1,""]},"finn.transformation.streamline.sign_to_thres":{ConvertSignToThres:[13,2,1,""]},"finn.transformation.streamline.sign_to_thres.ConvertSignToThres":{apply:[13,4,1,""]},"finn.util":{basic:[14,0,0,"-"],data_packing:[14,0,0,"-"],fpgadataflow:[14,0,0,"-"],onnx:[14,0,0,"-"],test:[14,0,0,"-"]},"finn.util.basic":{CppBuilder:[14,2,1,""],calculate_signed_dot_prod_range:[14,1,1,""],gen_finn_dt_tensor:[14,1,1,""],get_by_name:[14,1,1,""],get_finn_root:[14,1,1,""],interleave_matrix_outer_dim_from_partitions:[14,1,1,""],make_build_dir:[14,1,1,""],pad_tensor_to_multiple_of:[14,1,1,""],random_string:[14,1,1,""],remove_by_name:[14,1,1,""],roundup_to_integer_multiple:[14,1,1,""]},"finn.util.basic.CppBuilder":{append_includes:[14,4,1,""],append_sources:[14,4,1,""],build:[14,4,1,""],set_executable_path:[14,4,1,""]},"finn.util.data_packing":{array2hexstring:[14,1,1,""],finnpy_to_packed_bytearray:[14,1,1,""],hexstring2npbytearray:[14,1,1,""],npbytearray2hexstring:[14,1,1,""],npy_to_rtlsim_input:[14,1,1,""],numpy_to_hls_code:[14,1,1,""],pack_innermost_dim_as_hex_string:[14,1,1,""],packed_bytearray_to_finnpy:[14,1,1,""],rtlsim_output_to_npy:[14,1,1,""],unpack_innermost_dim_from_hex_string:[14,1,1,""]},"finn.util.fpgadataflow":{IPGenBuilder:[14,2,1,""],pyverilate_stitched_ip:[14,1,1,""]},"finn.util.fpgadataflow.IPGenBuilder":{append_tcl:[14,4,1,""],build:[14,4,1,""],set_ipgen_path:[14,4,1,""]},"finn.util.onnx":{valueinfo_to_tensor:[14,1,1,""]},"finn.util.test":{get_test_model_def_fxn:[14,1,1,""],get_test_model_trained:[14,1,1,""],get_test_model_untrained:[14,1,1,""],get_trained_checkpoint:[14,1,1,""]},finn:{analysis:[6,0,0,"-"],core:[8,0,0,"-"],custom_op:[9,0,0,"-"],transformation:[11,0,0,"-"],util:[14,0,0,"-"]}},objnames:{"0":["py","module","Python module"],"1":["py","function","Python function"],"2":["py","class","Python class"],"3":["py","attribute","Python attribute"],"4":["py","method","Python method"]},objtypes:{"0":"py:module","1":"py:function","2":"py:class","3":"py:attribute","4":"py:method"},terms:{"0f01":14,"0x07":14,"0x0e":14,"0x0f01":14,"0xb":14,"0xe":14,"600px":[],"abstract":[9,10,11],"boolean":8,"class":[8,9,10,11,12,13,14],"const":11,"default":[9,10,11],"enum":8,"final":8,"float":14,"function":[1,8,11,14],"import":1,"new":[1,2,8],"return":[6,7,8,9,10,11,13,14],"static":6,"true":[8,14],"try":1,"var":10,For:13,HLS:[2,8],IPs:12,PEs:10,The:[1,2,6,8,11,12,13,14],There:1,Use:[8,14],abc:[9,11],abit:14,about:[2,6,12],abov:1,absorb1bitmulintomatmul:13,absorb:[5,11,12],absorbaddintomultithreshold:13,absorbmulintomultithreshold:13,acceler:[1,12],account:8,action:12,activ:8,add:[11,13],adding:1,addit:1,addition:13,address:12,after:14,aim:13,align:[],all:[1,6,8,9,10,11,12,14],all_tensors_f32:6,allow:8,alreadi:12,also:[9,10,12],amount:14,analysi:[5,8,15],analysis_fxn:8,anaylsis_fxn:8,ani:[1,8,11,12,14],annot:[6,9,10],anoth:12,append_includ:14,append_sourc:14,append_tcl:14,appli:[8,11,12,13],apply_rep:11,appropri:[1,11],arbitrari:14,architectur:2,argument:1,around:8,arrai:14,array2hexstr:14,arxiv:13,assign:8,associ:[8,11],assum:14,attribut:[6,9,10,12],attribute_nam:[9,10],attributeproto:[9,10],back:1,backend:12,base:[8,9,10,11,12,13,14],basic:[5,15],batchnorm:11,batchnorm_to_affin:[5,15],batchnormtoaffin:11,been:12,befor:14,between:[10,14],binari:[8,10,12,13,14],bipolar:[8,10,11,13,14],bipolar_to_xnor:[5,15],bit:[8,14],bitfil:1,bitwidth:8,blackboxfunct:10,block:12,blott:10,board:12,bool:[6,11],both:14,bram_estim:10,brevita:2,brien:10,browser:1,build:14,built:6,calc_tmem:10,calc_wmem:10,calcul:10,calculate_signed_dot_prod_rang:14,call:[1,8,10,11,12],can:[1,2,8,11,12,13,14],cannot:11,center:[],centerpiec:2,certain:6,chang:[1,8,11],check:[6,8,9,10],check_all_tensor_shapes_specifi:8,check_compat:8,cleanup:[5,11],clk:[10,12],clone:[1,14],code:[12,14],code_gen_dir:14,code_generation_ipgen:10,code_generation_npysim:10,codegen_ipgen:[5,11],codegen_ipstitch:[5,11],codegen_npysim:[5,11],collaps:13,collapse_rep:[5,11],collapserepeatedadd:13,collapserepeatedmul:13,collapserepeatedop:13,collect:[1,12],colloqui:2,come:[1,6],command:1,commun:2,compar:[8,9],compare_execut:8,compare_fxn:8,compat:[8,9,10],compil:[2,5,11],compile_singlenode_cod:10,complet:1,compon:2,comput:[1,8],consecut:13,constant:[6,8,13],construct:2,consum:8,contain:[1,2,8,9,12,14],content:15,context:[8,9,10],contribut:2,convent:6,convert:[1,10,11,12,13,14],convert_to_hls_lay:[5,11],convertbipolarmatmultoxnorpopcount:11,convertsigntothr:13,convertsubtoadd:11,convolutioninputgener:[5,9],copi:[8,11,12],core:[5,15],corner:2,correct:11,correctli:[1,6,9,10,12],correspond:[2,8,9,10],count:10,cpp_file:14,cppbuilder:14,creat:[1,8,12,14],create_dataflow_partit:[5,11],createdataflowpartit:12,current:[2,8],custom:[1,2,6,8],custom_op:[5,15],customop:[9,10],data:[9,12,14],data_pack:[5,15],dataflow:[2,8,12],dataoutstrm:10,datatyp:[5,9,10,11,14,15],debug:8,declar:11,deep:[2,8,10,11],default_v:[9,10],default_valu:[9,10],defin:10,depend:1,deploi:1,deploy:12,deploytopynq:12,design:[1,12],detail:2,develop:2,dict:[8,9,10],dictionari:[6,8],differ:1,digit:14,dimens:14,dimension:14,dir:[12,14],directori:[1,12,14],distr_pad:14,divis:14,dnn:[],doc:2,docker:14,dockerfil:1,docomput:10,doe:1,don:11,done:6,dot:14,down:1,driver:12,dt_a:14,dt_b:14,dtype:[6,8,9,10,14],dynam:6,dynamic_input_to_npi:10,each:[2,6,8,11,13,14],editor:1,effect:11,either:1,element:14,embed:8,emit:14,emphasi:2,empti:8,end:10,ensur:[10,11,12,14],entir:1,enumer:[8,11],environ:1,equal:[9,10],equival:13,estim:7,even:11,evenli:14,everi:11,everyth:1,exampl:[1,14],excel:1,exec_precompiled_singlenode_model:10,execut:[8,9,10],execute_custom_nod:[5,15],execute_nod:[8,9,10],execute_onnx:8,execute_onnx_and_make_model:8,execution_context:8,exist:[9,14],exit:14,expect:[6,8,9,10,12],experi:2,experiment:2,explor:[2,8,10],expos:8,extens:1,extra:[1,6,14],extract:[6,7],f5c6bd32ae93ec103a88152214baedff4ce1850d81065bfc:1,factor:14,factoroutmulsignmagnitud:13,fals:[8,11,14],familiar:1,fan:6,fast:10,fewest:8,field:[12,14],file:[1,8,12,14],filenam:[8,12],find:8,find_consum:8,find_produc:8,finn:[],finn_dt:14,finnpy_to_packed_bytearrai:14,first:[6,13],fix:[11,14],flatten:14,float32:[6,8],flow:[],fold_const:[5,15],foldconst:11,folder:[1,12,14],follow:[1,2,6,12],form:10,forward:1,found:[2,12],four:14,fpga:[1,2],fpgadataflow:[5,6,9,11,15],fpgapart:[10,12],framework:[2,10],fraser:10,from:[1,2,7,8,12,14],full:8,further:11,gambardella:10,gen_finn_dt_tensor:14,gener:[2,5,12,14,15],generate_param:10,get:[8,9],get_all_tensor_nam:8,get_by_nam:14,get_finn_root:14,get_folded_input_shap:10,get_folded_output_shap:10,get_hls_compatible_threshold_tensor:10,get_hls_compatible_weight_tensor:10,get_hls_datatype_str:8,get_initi:8,get_input_datatyp:10,get_instream_width:10,get_metadata_prop:8,get_nodeattr:9,get_nodeattr_typ:[9,10],get_num_possible_valu:8,get_number_output_valu:10,get_output_datatyp:10,get_outstream_width:10,get_per_tensor_fanout:6,get_smallest_poss:8,get_stream_width:10,get_template_param_valu:10,get_tensor_datatyp:8,get_tensor_fanout:8,get_tensor_shap:8,get_tensor_valueinfo:8,get_test_model_def_fxn:14,get_test_model_train:14,get_test_model_untrain:14,get_trained_checkpoint:14,get_weight_datatyp:10,getcustomop:9,github:2,give:[1,11,13],give_unique_node_nam:11,given:[6,7,8,9,10,14],giverandomtensornam:11,givereadabletensornam:11,giveuniquenodenam:11,global_includ:10,graph:[6,8,9,10,11,12],graphic:2,guarante:11,guid:5,hand:2,has:[6,8,11,12,14],have:[1,6,8,11,12,13],height:[],help:1,hex:14,hexstr:14,hexstring2npbytearrai:14,high:1,highli:2,hls_synth_res_estim:[5,6],hls_var_nam:14,hlscustomop:10,hlslib:[2,10],hlssynth_ipgen:[5,11],homepag:2,host:[1,14],how:[5,14],http:1,human:11,imag:[],img:[],immedi:12,implement:8,includ:[2,8,12],index:[],indic:[8,9,10,11,12],infer:[1,2,8,9,10,11,14],infer_datatyp:[5,15],infer_node_datatyp:[9,10],infer_shap:[5,15],inferbinarystreamingfclay:12,inferdatatyp:11,infershap:11,infinit:11,info:[11,14],info_messag:6,inform:[6,12],infrastructur:12,inherit:11,initi:[6,8],innermost:14,inp0:9,inp1:9,inp:10,input:[6,8,9,10,11,13,14],input_dict:8,input_dtyp:14,input_fil:14,insert:[12,14],insert_tlastmark:[5,11],inserttlastmark:12,insid:[1,9],instal:1,instanc:[8,9,10,13],instanti:12,instead:14,int16:8,int2:8,int32:8,int3:8,int4:8,int8:8,integ:[8,13,14],intend:[],interfac:12,interleav:10,interleave_matrix_outer_dim_from_partit:14,intermedi:[8,11],intern:11,involv:1,ipgen_singlenode_cod:10,ipgenbuild:14,is_integ:8,is_linear:6,item:14,jupyt:2,kei:8,know:11,lab:2,lambda:8,largest:8,launch:1,layer:[11,12],lead:14,learn:[2,10],leeser:10,len:14,let:11,letter:14,librari:2,library_path:14,like:1,linear:[6,8],link:[1,2],list:[6,8],locat:1,look:[1,6],loop:11,lut_estim:10,made:[8,11],magnitud:13,mai:1,make:[1,11,12],make_build_dir:14,make_collapsed_param_fxn:13,make_deepcopi:8,make_deploy:[5,11],make_empty_exec_context:8,make_new_valueinfo_nam:8,make_project:12,make_pynq_driv:[5,11],make_pynq_proj:[5,11],make_shape_compatible_op:[9,10],makepynqdriv:12,makepynqproject:12,mani:1,manipul:8,manual:11,matmul:[11,13],matrix:[10,13,14],max:[8,14],mean:14,meant:11,member:[9,10],metadata_prop:[8,12],min:[8,14],minimum:14,mixtur:6,mkdtemp:14,mode:[1,12],model:[6,7,8,9,10,11,12,13,14],model_a:8,model_b:8,model_was_chang:11,modelproto:[8,12],modelwrapp:[5,6,11,15],modul:15,modular:2,more:[2,8,11,14],mount:1,move:13,moveaddpastmul:13,movescalaraddpastmatmul:13,movescalarmulpastmatmul:13,mul:[11,13],multidimension:14,multipl:[11,13,14],multipli:13,multithreshold:[5,12,13,15],must:[9,11,12,13,14],mvtu:12,n_partit:14,n_thres_step:10,name:[6,7,8,9,11,14],name_field:14,ndarrai:14,nearest:[13,14],necessari:12,need:[7,9,10,11],neg:[8,13],netnam:14,netron:1,network:[1,2,10],neural:[2,10],new_nam:8,next:13,no_decl:14,node:[6,7,8,9,10,11,12,13],node_inputs_in_expected_ord:6,node_res_estim:10,non:12,none:[8,9,14],note:1,notebook:2,notwithstand:6,now:[6,8],npbytearrai:14,npbytearray2hexstr:14,npy:14,npy_to_dynamic_output:10,npy_to_rtlsim_input:14,number:[8,9,10,14],numpi:[10,14],numpy_to_hls_cod:14,object:[8,14],old_nam:8,onc:11,one:[6,8,12,14],ones:1,onli:[6,8,11,12,13],onlin:1,onnx:[5,8,9,10,12,15],onnx_exec:[5,15],onnx_model_proto:8,onnx_nod:[9,10],onnxruntim:8,op_nam:13,op_typ:6,open:1,oper:[8,13],ops:[6,13],option:1,order:6,orig_thres_matrix:10,orig_weight_matrix:10,origin:10,other:[8,13],otherwis:[1,8,11,14],out:6,out_bia:9,out_scal:9,out_shap:14,outcom:12,output:[8,9,10,11,14],output_shap:14,overlai:12,overview:2,own:1,pack:[12,14],pack_innermost_dim:14,pack_innermost_dim_as_hex_str:14,packag:15,packed_bytearrai:14,packed_bytearray_to_finnpi:14,packedbit:14,pad:14,pad_tensor_to_multiple_of:14,pad_to_dim:14,pad_to_nbit:14,page:[],pair:12,paramet:13,part:[9,14],particular:[9,10,14],partit:8,pass:[5,10],password:12,past:13,path:[10,14],per:12,perform:[1,9,10],permit:[9,10],place:12,platform:12,png:[],point:[1,11],port:1,posit:[10,13,14],possibl:[8,12],pragma:10,preced:13,precid:13,precis:14,precomput:11,prefer:8,prefix:14,prepend:14,preusser:10,previous:12,print:1,prior:[11,12,14],process:1,produc:[6,8],product:14,project:[2,12],properti:[6,8],provid:[1,8],pushbutton:1,pynq:12,pynq_driver_dir:12,python:[1,12,14],pyveril:[8,14],pyverilate_stitched_ip:14,qnn:[1,2],quantiz:[2,6,10],random:[11,14],random_str:14,randomli:14,rather:1,reach:11,read:2,read_npy_data:10,readabl:11,readthedoc:[],recommend:11,refer:2,reflect:1,registri:[5,15],relat:2,remot:8,remote_exec:[5,15],remov:[12,14],remove_by_nam:14,remove_prefix:14,renam:8,rename_tensor:8,reorder:[5,11],repeat:[11,13],repeatedli:8,replac:11,repo:1,repositori:[1,2],repositroi:[],repres:[8,14],represent:14,requir:[8,9,10],res_estim:[5,6],research:2,reset_rtlsim:10,reshap:10,resourc:[1,7],respect:14,result:[6,7,8,11,12,13,14],return_full_exec_context:8,returned_dict:[9,10],revers:14,reverse_endian:14,reverse_inn:14,right:2,root:[1,14],round:[13,14],round_threshold:[5,11],roundandclipthreshold:13,roundup_to_integer_multipl:14,row:10,rtlsim:[8,10],rtlsim_exec:[5,15],rtlsim_output_to_npi:14,run:[8,12],run_dock:1,same:[12,14],save:[8,14],save_as_npi:10,scalar:13,scale:[],scp:12,script:[1,12],search:[],second:[12,13],see:[13,14],seen:2,sep:10,separ:2,sequenc:14,server:1,set:[1,8,9,10,12,13,14],set_attribut:[],set_exec_mod:[5,11],set_executable_path:14,set_initi:8,set_ipgen_path:14,set_metadata_prop:8,set_nodeattr:9,set_sim_mod:[],set_tensor_datatyp:8,set_tensor_shap:8,setexecmod:12,setsimmod:[],settings64:1,sever:1,shape:[8,9,10,11,14],shell:12,should:[1,6,8,11],sign:[8,11,13,14],sign_to_thr:[5,11],sim:[10,14],sim_mod:12,simd:10,simpli:1,sinc:[8,14],singl:[1,8,13,14],small:6,smallest:8,some:[1,2,8,11],someth:1,space:[],spawn:1,specif:2,specifi:[8,11,14],split:[12,13,14],stai:2,standard:[8,9,10],stitch:[8,12,14],store:[9,12,14],streamingdataflowpartit:[5,12,15],streamingfclayer_batch:[5,9,12],streamingmaxpool_batch:[5,9],streamlin:[5,11],string:[6,14],stringlength:14,strm_decl:10,structur:6,style:2,sub:11,subdirectori:12,subgraph:8,submodul:[5,15],subpackag:15,subset:6,success:12,suitabl:10,sure:1,surviv:14,synth_pynq_proj:[5,11],synthesi:[7,12],synthpynqproject:12,take:[1,6,8,11,13,14],taken:[2,8,12],target:[2,12],target_dir:12,targetbit:14,tcl:12,tcl_script:14,tempfil:14,templat:[5,9,11],temporari:14,tensor:[6,8,11,13,14],tensor_fanout:6,tensor_nam:[6,8],tensor_shap:[8,14],tensor_valu:8,termin:[1,12],ternari:8,test:[5,11,15],text:1,thei:13,them:[6,12,13],thi:[1,2,6,8,9,10,11,12,14],thing:2,thought:1,threshold:[9,10,13],time:[1,11],tlastmark:[5,9,12],tmem:10,togeth:12,toggle_clk:10,token:1,tool:[1,2],topolog:[5,15],train:[1,2],transform:[5,8,15],transformed_model:11,travers:6,tune:2,tupl:11,two:[2,8,12,13,14],type:[8,11,14],ubuntu:1,uint16:8,uint2:[8,14],uint32:8,uint3:8,uint4:8,uint8:[8,14],umuroglu:10,under:[2,12],uniqu:11,unpack:[12,14],unpack_innermost_dim_from_hex_str:14,unsign:[8,13],until:8,updat:[2,13],upper:2,use:2,used:[2,8,9,10,14],useful:8,user:11,usernam:12,using:[2,8,11,13,14],util:[5,8,9,10,15],val:14,valu:[8,9,10,12,13,14],value_info:8,valueinfo:[8,11],valueinfo_to_tensor:14,valueinfoproto:[8,14],variabl:[1,14],vector:[13,14],verif:6,verifi:[6,9,10],verify_custom_nod:[5,15],verify_nod:[6,9,10],version:2,via:8,view:2,visser:10,vivado:[1,2,7,8,12],vivado_path:1,vivado_pynq_proj:12,vivado_stitch_proj:12,wai:[1,6],want:13,wbit:14,websit:2,weight:[8,10],welcom:2,well:1,when:[6,11],where:[1,8,9,10,12,13],whether:[6,8,9,10,11],which:[1,2,8,9,10,12,13,14],width:14,without:1,wmem:10,work:[1,8,14],workspac:1,wrapper:8,write:[1,5],xdnn:[],xilinx:2,xnorpopcount:[5,15],xnorpopcountmatmul:[9,11,12],you:[1,11],your:[1,11],zero:[8,13,14]},titles:["FINN - End-to-End Flow","Getting Started","FINN","src","Source Code","finn package","finn.analysis package","finn.analysis.fpgadataflow package","finn.core package","finn.custom_op package","finn.custom_op.fpgadataflow package","finn.transformation package","finn.transformation.fpgadataflow package","finn.transformation.streamline package","finn.util package","finn"],titleterms:{absorb:13,analysi:[6,7],basic:14,batchnorm_to_affin:11,bipolar_to_xnor:11,cleanup:12,code:4,codegen_ipgen:12,codegen_ipstitch:12,codegen_npysim:12,collapse_rep:13,compil:[1,12],content:[5,6,7,8,9,10,11,12,13,14],convert_to_hls_lay:12,convolutioninputgener:10,core:8,create_dataflow_partit:12,custom_op:[9,10],data_pack:14,datatyp:8,develop:1,directli:1,docker:1,document:[],end:0,execute_custom_nod:8,experiment:1,finn:[0,1,2,5,6,7,8,9,10,11,12,13,14,15],flow:0,fold_const:11,fpgadataflow:[7,10,12,14],gener:11,get:1,guid:11,hls_synth_res_estim:7,hlssynth_ipgen:12,how:[1,6],indic:[],infer_datatyp:11,infer_shap:11,insert_tlastmark:12,interact:1,jenkin:1,jupyt:1,make_deploy:12,make_pynq_driv:12,make_pynq_proj:12,modelwrapp:8,modul:[5,6,7,8,9,10,11,12,13,14],multithreshold:9,notebook:1,onnx:14,onnx_exec:8,packag:[5,6,7,8,9,10,11,12,13,14],pass:6,registri:9,remote_exec:8,reorder:13,requir:1,res_estim:7,round_threshold:13,rtlsim_exec:8,run:1,set_exec_mod:12,set_sim_mod:[],shell:1,sign_to_thr:13,sourc:4,src:3,start:1,streamingdataflowpartit:9,streamingfclayer_batch:10,streamingmaxpool_batch:10,streamlin:13,submodul:[6,7,8,9,10,11,12,13,14],subpackag:[5,6,9,11],suit:1,synth_pynq_proj:12,tabl:[],templat:[10,12],test:[1,14],tlastmark:10,topolog:6,transform:[11,12,13],use:1,using:1,util:14,verify_custom_nod:6,welcom:[],what:2,write:[6,11],xnorpopcount:9}})