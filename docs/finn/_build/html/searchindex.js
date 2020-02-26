Search.setIndex({docnames:["brevitas_export","end_to_end_flow","genindex","getting_started","index","internals","nw_prep","pynq_deploy","source_code/finn","source_code/finn.analysis","source_code/finn.analysis.fpgadataflow","source_code/finn.core","source_code/finn.custom_op","source_code/finn.custom_op.fpgadataflow","source_code/finn.transformation","source_code/finn.transformation.fpgadataflow","source_code/finn.transformation.streamline","source_code/finn.util","source_code/modules","tutorials","verification","vivado_synth"],envversion:{"sphinx.domains.c":1,"sphinx.domains.changeset":1,"sphinx.domains.citation":1,"sphinx.domains.cpp":1,"sphinx.domains.index":1,"sphinx.domains.javascript":1,"sphinx.domains.math":2,"sphinx.domains.python":1,"sphinx.domains.rst":1,"sphinx.domains.std":1,sphinx:56},filenames:["brevitas_export.rst","end_to_end_flow.rst","genindex.rst","getting_started.rst","index.rst","internals.rst","nw_prep.rst","pynq_deploy.rst","source_code/finn.rst","source_code/finn.analysis.rst","source_code/finn.analysis.fpgadataflow.rst","source_code/finn.core.rst","source_code/finn.custom_op.rst","source_code/finn.custom_op.fpgadataflow.rst","source_code/finn.transformation.rst","source_code/finn.transformation.fpgadataflow.rst","source_code/finn.transformation.streamline.rst","source_code/finn.util.rst","source_code/modules.rst","tutorials.rst","verification.rst","vivado_synth.rst"],objects:{"finn.analysis":{topology:[9,0,0,"-"],verify_custom_nodes:[9,0,0,"-"]},"finn.analysis.fpgadataflow":{hls_synth_res_estimation:[10,0,0,"-"],res_estimation:[10,0,0,"-"]},"finn.analysis.fpgadataflow.hls_synth_res_estimation":{hls_synth_res_estimation:[10,1,1,""]},"finn.analysis.fpgadataflow.res_estimation":{res_estimation:[10,1,1,""]},"finn.analysis.topology":{all_tensors_f32:[9,1,1,""],get_per_tensor_fanouts:[9,1,1,""],is_linear:[9,1,1,""],node_inputs_in_expected_order:[9,1,1,""]},"finn.analysis.verify_custom_nodes":{verify_nodes:[9,1,1,""]},"finn.core":{datatype:[11,0,0,"-"],execute_custom_node:[11,0,0,"-"],modelwrapper:[11,0,0,"-"],onnx_exec:[11,0,0,"-"],remote_exec:[11,0,0,"-"],rtlsim_exec:[11,0,0,"-"]},"finn.core.datatype":{DataType:[11,2,1,""]},"finn.core.datatype.DataType":{BINARY:[11,3,1,""],BIPOLAR:[11,3,1,""],FLOAT32:[11,3,1,""],INT16:[11,3,1,""],INT2:[11,3,1,""],INT32:[11,3,1,""],INT3:[11,3,1,""],INT4:[11,3,1,""],INT8:[11,3,1,""],TERNARY:[11,3,1,""],UINT16:[11,3,1,""],UINT2:[11,3,1,""],UINT32:[11,3,1,""],UINT3:[11,3,1,""],UINT4:[11,3,1,""],UINT8:[11,3,1,""],allowed:[11,4,1,""],bitwidth:[11,4,1,""],get_hls_datatype_str:[11,4,1,""],get_num_possible_values:[11,4,1,""],get_smallest_possible:[11,4,1,""],is_integer:[11,4,1,""],max:[11,4,1,""],min:[11,4,1,""],signed:[11,4,1,""]},"finn.core.execute_custom_node":{execute_custom_node:[11,1,1,""]},"finn.core.modelwrapper":{ModelWrapper:[11,2,1,""]},"finn.core.modelwrapper.ModelWrapper":{analysis:[11,4,1,""],check_all_tensor_shapes_specified:[11,4,1,""],check_compatibility:[11,4,1,""],find_consumer:[11,4,1,""],find_producer:[11,4,1,""],get_all_tensor_names:[11,4,1,""],get_initializer:[11,4,1,""],get_metadata_prop:[11,4,1,""],get_tensor_datatype:[11,4,1,""],get_tensor_fanout:[11,4,1,""],get_tensor_shape:[11,4,1,""],get_tensor_valueinfo:[11,4,1,""],graph:[11,4,1,""],make_empty_exec_context:[11,4,1,""],make_new_valueinfo_name:[11,4,1,""],model:[11,4,1,""],rename_tensor:[11,4,1,""],save:[11,4,1,""],set_initializer:[11,4,1,""],set_metadata_prop:[11,4,1,""],set_tensor_datatype:[11,4,1,""],set_tensor_shape:[11,4,1,""],transform:[11,4,1,""]},"finn.core.onnx_exec":{compare_execution:[11,1,1,""],execute_node:[11,1,1,""],execute_onnx:[11,1,1,""],execute_onnx_and_make_model:[11,1,1,""]},"finn.core.remote_exec":{remote_exec:[11,1,1,""]},"finn.core.rtlsim_exec":{rtlsim_exec:[11,1,1,""]},"finn.custom_op":{CustomOp:[12,2,1,""],fpgadataflow:[13,0,0,"-"],multithreshold:[12,0,0,"-"],registry:[12,0,0,"-"],streamingdataflowpartition:[12,0,0,"-"],xnorpopcount:[12,0,0,"-"]},"finn.custom_op.CustomOp":{execute_node:[12,4,1,""],get_nodeattr:[12,4,1,""],get_nodeattr_types:[12,4,1,""],infer_node_datatype:[12,4,1,""],make_shape_compatible_op:[12,4,1,""],set_nodeattr:[12,4,1,""],verify_node:[12,4,1,""]},"finn.custom_op.fpgadataflow":{HLSCustomOp:[13,2,1,""],convolutioninputgenerator:[13,0,0,"-"],streamingfclayer_batch:[13,0,0,"-"],streamingmaxpool_batch:[13,0,0,"-"],templates:[13,0,0,"-"],tlastmarker:[13,0,0,"-"]},"finn.custom_op.fpgadataflow.HLSCustomOp":{blackboxfunction:[13,4,1,""],bram_estimation:[13,4,1,""],code_generation_ipgen:[13,4,1,""],code_generation_npysim:[13,4,1,""],compile_singlenode_code:[13,4,1,""],dataoutstrm:[13,4,1,""],defines:[13,4,1,""],docompute:[13,4,1,""],dynamic_input_to_npy:[13,4,1,""],exec_precompiled_singlenode_model:[13,4,1,""],execute_node:[13,4,1,""],generate_params:[13,4,1,""],get_folded_input_shape:[13,4,1,""],get_folded_output_shape:[13,4,1,""],get_instream_width:[13,4,1,""],get_nodeattr_types:[13,4,1,""],get_number_output_values:[13,4,1,""],get_outstream_width:[13,4,1,""],global_includes:[13,4,1,""],ipgen_singlenode_code:[13,4,1,""],lut_estimation:[13,4,1,""],node_res_estimation:[13,4,1,""],npy_to_dynamic_output:[13,4,1,""],pragmas:[13,4,1,""],read_npy_data:[13,4,1,""],reset_rtlsim:[13,4,1,""],rtlsim:[13,4,1,""],save_as_npy:[13,4,1,""],strm_decl:[13,4,1,""],toggle_clk:[13,4,1,""]},"finn.custom_op.fpgadataflow.convolutioninputgenerator":{ConvolutionInputGenerator:[13,2,1,""]},"finn.custom_op.fpgadataflow.convolutioninputgenerator.ConvolutionInputGenerator":{blackboxfunction:[13,4,1,""],bram_estimation:[13,4,1,""],dataoutstrm:[13,4,1,""],defines:[13,4,1,""],docompute:[13,4,1,""],execute_node:[13,4,1,""],get_input_datatype:[13,4,1,""],get_nodeattr_types:[13,4,1,""],get_number_output_values:[13,4,1,""],get_output_datatype:[13,4,1,""],get_stream_width:[13,4,1,""],global_includes:[13,4,1,""],infer_node_datatype:[13,4,1,""],lut_estimation:[13,4,1,""],make_shape_compatible_op:[13,4,1,""],pragmas:[13,4,1,""],read_npy_data:[13,4,1,""],save_as_npy:[13,4,1,""],strm_decl:[13,4,1,""],verify_node:[13,4,1,""]},"finn.custom_op.fpgadataflow.streamingfclayer_batch":{StreamingFCLayer_Batch:[13,2,1,""]},"finn.custom_op.fpgadataflow.streamingfclayer_batch.StreamingFCLayer_Batch":{blackboxfunction:[13,4,1,""],bram_estimation:[13,4,1,""],calc_tmem:[13,4,1,""],calc_wmem:[13,4,1,""],dataoutstrm:[13,4,1,""],defines:[13,4,1,""],docompute:[13,4,1,""],execute_node:[13,4,1,""],generate_params:[13,4,1,""],get_folded_input_shape:[13,4,1,""],get_folded_output_shape:[13,4,1,""],get_hls_compatible_threshold_tensor:[13,4,1,""],get_hls_compatible_weight_tensor:[13,4,1,""],get_input_datatype:[13,4,1,""],get_instream_width:[13,4,1,""],get_nodeattr_types:[13,4,1,""],get_number_output_values:[13,4,1,""],get_output_datatype:[13,4,1,""],get_outstream_width:[13,4,1,""],get_template_param_values:[13,4,1,""],get_weight_datatype:[13,4,1,""],global_includes:[13,4,1,""],infer_node_datatype:[13,4,1,""],lut_estimation:[13,4,1,""],make_shape_compatible_op:[13,4,1,""],pragmas:[13,4,1,""],read_npy_data:[13,4,1,""],save_as_npy:[13,4,1,""],strm_decl:[13,4,1,""],verify_node:[13,4,1,""]},"finn.custom_op.fpgadataflow.streamingmaxpool_batch":{StreamingMaxPool_Batch:[13,2,1,""]},"finn.custom_op.fpgadataflow.streamingmaxpool_batch.StreamingMaxPool_Batch":{blackboxfunction:[13,4,1,""],bram_estimation:[13,4,1,""],dataoutstrm:[13,4,1,""],defines:[13,4,1,""],docompute:[13,4,1,""],get_nodeattr_types:[13,4,1,""],get_number_output_values:[13,4,1,""],global_includes:[13,4,1,""],infer_node_datatype:[13,4,1,""],lut_estimation:[13,4,1,""],make_shape_compatible_op:[13,4,1,""],pragmas:[13,4,1,""],read_npy_data:[13,4,1,""],save_as_npy:[13,4,1,""],strm_decl:[13,4,1,""],verify_node:[13,4,1,""]},"finn.custom_op.fpgadataflow.tlastmarker":{TLastMarker:[13,2,1,""]},"finn.custom_op.fpgadataflow.tlastmarker.TLastMarker":{blackboxfunction:[13,4,1,""],dataoutstrm:[13,4,1,""],defines:[13,4,1,""],docompute:[13,4,1,""],execute_node:[13,4,1,""],get_folded_input_shape:[13,4,1,""],get_folded_output_shape:[13,4,1,""],get_instream_width:[13,4,1,""],get_nodeattr_types:[13,4,1,""],get_number_output_values:[13,4,1,""],get_outstream_width:[13,4,1,""],global_includes:[13,4,1,""],infer_node_datatype:[13,4,1,""],make_shape_compatible_op:[13,4,1,""],pragmas:[13,4,1,""],read_npy_data:[13,4,1,""],save_as_npy:[13,4,1,""],strm_decl:[13,4,1,""],verify_node:[13,4,1,""]},"finn.custom_op.multithreshold":{MultiThreshold:[12,2,1,""],compare:[12,1,1,""],multithreshold:[12,1,1,""]},"finn.custom_op.multithreshold.MultiThreshold":{execute_node:[12,4,1,""],get_nodeattr_types:[12,4,1,""],infer_node_datatype:[12,4,1,""],make_shape_compatible_op:[12,4,1,""],verify_node:[12,4,1,""]},"finn.custom_op.registry":{getCustomOp:[12,1,1,""]},"finn.custom_op.streamingdataflowpartition":{StreamingDataflowPartition:[12,2,1,""]},"finn.custom_op.streamingdataflowpartition.StreamingDataflowPartition":{execute_node:[12,4,1,""],get_nodeattr_types:[12,4,1,""],infer_node_datatype:[12,4,1,""],make_shape_compatible_op:[12,4,1,""],verify_node:[12,4,1,""]},"finn.custom_op.xnorpopcount":{XnorPopcountMatMul:[12,2,1,""],xnorpopcountmatmul:[12,1,1,""]},"finn.custom_op.xnorpopcount.XnorPopcountMatMul":{execute_node:[12,4,1,""],get_nodeattr_types:[12,4,1,""],infer_node_datatype:[12,4,1,""],make_shape_compatible_op:[12,4,1,""],verify_node:[12,4,1,""]},"finn.transformation":{batchnorm_to_affine:[14,0,0,"-"],bipolar_to_xnor:[14,0,0,"-"],fold_constants:[14,0,0,"-"],general:[14,0,0,"-"],infer_datatypes:[14,0,0,"-"],infer_shapes:[14,0,0,"-"],streamline:[16,0,0,"-"]},"finn.transformation.batchnorm_to_affine":{BatchNormToAffine:[14,2,1,""]},"finn.transformation.batchnorm_to_affine.BatchNormToAffine":{apply:[14,4,1,""]},"finn.transformation.bipolar_to_xnor":{ConvertBipolarMatMulToXnorPopcount:[14,2,1,""]},"finn.transformation.bipolar_to_xnor.ConvertBipolarMatMulToXnorPopcount":{apply:[14,4,1,""]},"finn.transformation.fold_constants":{FoldConstants:[14,2,1,""]},"finn.transformation.fold_constants.FoldConstants":{apply:[14,4,1,""]},"finn.transformation.fpgadataflow":{cleanup:[15,0,0,"-"],codegen_ipgen:[15,0,0,"-"],codegen_ipstitch:[15,0,0,"-"],codegen_npysim:[15,0,0,"-"],compile:[15,0,0,"-"],convert_to_hls_layers:[15,0,0,"-"],create_dataflow_partition:[15,0,0,"-"],hlssynth_ipgen:[15,0,0,"-"],insert_tlastmarker:[15,0,0,"-"],make_deployment:[15,0,0,"-"],make_pynq_driver:[15,0,0,"-"],make_pynq_proj:[15,0,0,"-"],replace_verilog_relpaths:[15,0,0,"-"],set_exec_mode:[15,0,0,"-"],synth_pynq_proj:[15,0,0,"-"],templates:[15,0,0,"-"]},"finn.transformation.fpgadataflow.cleanup":{CleanUp:[15,2,1,""]},"finn.transformation.fpgadataflow.cleanup.CleanUp":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.codegen_ipgen":{CodeGen_ipgen:[15,2,1,""]},"finn.transformation.fpgadataflow.codegen_ipgen.CodeGen_ipgen":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.codegen_ipstitch":{CodeGen_ipstitch:[15,2,1,""]},"finn.transformation.fpgadataflow.codegen_ipstitch.CodeGen_ipstitch":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.codegen_npysim":{CodeGen_npysim:[15,2,1,""]},"finn.transformation.fpgadataflow.codegen_npysim.CodeGen_npysim":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.compile":{Compile:[15,2,1,""]},"finn.transformation.fpgadataflow.compile.Compile":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.convert_to_hls_layers":{InferBinaryStreamingFCLayer:[15,2,1,""]},"finn.transformation.fpgadataflow.convert_to_hls_layers.InferBinaryStreamingFCLayer":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.create_dataflow_partition":{CreateDataflowPartition:[15,2,1,""]},"finn.transformation.fpgadataflow.create_dataflow_partition.CreateDataflowPartition":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.hlssynth_ipgen":{HLSSynth_IPGen:[15,2,1,""]},"finn.transformation.fpgadataflow.hlssynth_ipgen.HLSSynth_IPGen":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.insert_tlastmarker":{InsertTLastMarker:[15,2,1,""]},"finn.transformation.fpgadataflow.insert_tlastmarker.InsertTLastMarker":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.make_deployment":{DeployToPYNQ:[15,2,1,""]},"finn.transformation.fpgadataflow.make_deployment.DeployToPYNQ":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.make_pynq_driver":{MakePYNQDriver:[15,2,1,""]},"finn.transformation.fpgadataflow.make_pynq_driver.MakePYNQDriver":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.make_pynq_proj":{MakePYNQProject:[15,2,1,""]},"finn.transformation.fpgadataflow.make_pynq_proj.MakePYNQProject":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.replace_verilog_relpaths":{ReplaceVerilogRelPaths:[15,2,1,""]},"finn.transformation.fpgadataflow.replace_verilog_relpaths.ReplaceVerilogRelPaths":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.set_exec_mode":{SetExecMode:[15,2,1,""]},"finn.transformation.fpgadataflow.set_exec_mode.SetExecMode":{apply:[15,4,1,""]},"finn.transformation.fpgadataflow.synth_pynq_proj":{SynthPYNQProject:[15,2,1,""]},"finn.transformation.fpgadataflow.synth_pynq_proj.SynthPYNQProject":{apply:[15,4,1,""]},"finn.transformation.general":{ConvertSubToAdd:[14,2,1,""],GiveRandomTensorNames:[14,2,1,""],GiveReadableTensorNames:[14,2,1,""],GiveUniqueNodeNames:[14,2,1,""]},"finn.transformation.general.ConvertSubToAdd":{apply:[14,4,1,""]},"finn.transformation.general.GiveRandomTensorNames":{apply:[14,4,1,""]},"finn.transformation.general.GiveReadableTensorNames":{apply:[14,4,1,""]},"finn.transformation.general.GiveUniqueNodeNames":{apply:[14,4,1,""]},"finn.transformation.infer_datatypes":{InferDataTypes:[14,2,1,""]},"finn.transformation.infer_datatypes.InferDataTypes":{apply:[14,4,1,""]},"finn.transformation.infer_shapes":{InferShapes:[14,2,1,""]},"finn.transformation.infer_shapes.InferShapes":{apply:[14,4,1,""]},"finn.transformation.streamline":{Streamline:[16,2,1,""],absorb:[16,0,0,"-"],collapse_repeated:[16,0,0,"-"],reorder:[16,0,0,"-"],round_thresholds:[16,0,0,"-"],sign_to_thres:[16,0,0,"-"]},"finn.transformation.streamline.Streamline":{apply:[16,4,1,""]},"finn.transformation.streamline.absorb":{Absorb1BitMulIntoMatMul:[16,2,1,""],AbsorbAddIntoMultiThreshold:[16,2,1,""],AbsorbMulIntoMultiThreshold:[16,2,1,""],FactorOutMulSignMagnitude:[16,2,1,""]},"finn.transformation.streamline.absorb.Absorb1BitMulIntoMatMul":{apply:[16,4,1,""]},"finn.transformation.streamline.absorb.AbsorbAddIntoMultiThreshold":{apply:[16,4,1,""]},"finn.transformation.streamline.absorb.AbsorbMulIntoMultiThreshold":{apply:[16,4,1,""]},"finn.transformation.streamline.absorb.FactorOutMulSignMagnitude":{apply:[16,4,1,""]},"finn.transformation.streamline.collapse_repeated":{CollapseRepeatedAdd:[16,2,1,""],CollapseRepeatedMul:[16,2,1,""],CollapseRepeatedOp:[16,2,1,""]},"finn.transformation.streamline.collapse_repeated.CollapseRepeatedOp":{apply:[16,4,1,""]},"finn.transformation.streamline.reorder":{MoveAddPastMul:[16,2,1,""],MoveScalarAddPastMatMul:[16,2,1,""],MoveScalarMulPastMatMul:[16,2,1,""]},"finn.transformation.streamline.reorder.MoveAddPastMul":{apply:[16,4,1,""]},"finn.transformation.streamline.reorder.MoveScalarAddPastMatMul":{apply:[16,4,1,""]},"finn.transformation.streamline.reorder.MoveScalarMulPastMatMul":{apply:[16,4,1,""]},"finn.transformation.streamline.round_thresholds":{RoundAndClipThresholds:[16,2,1,""]},"finn.transformation.streamline.round_thresholds.RoundAndClipThresholds":{apply:[16,4,1,""]},"finn.transformation.streamline.sign_to_thres":{ConvertSignToThres:[16,2,1,""]},"finn.transformation.streamline.sign_to_thres.ConvertSignToThres":{apply:[16,4,1,""]},"finn.util":{basic:[17,0,0,"-"],data_packing:[17,0,0,"-"],fpgadataflow:[17,0,0,"-"],onnx:[17,0,0,"-"],test:[17,0,0,"-"]},"finn.util.basic":{CppBuilder:[17,2,1,""],calculate_signed_dot_prod_range:[17,1,1,""],gen_finn_dt_tensor:[17,1,1,""],get_by_name:[17,1,1,""],get_finn_root:[17,1,1,""],interleave_matrix_outer_dim_from_partitions:[17,1,1,""],make_build_dir:[17,1,1,""],pad_tensor_to_multiple_of:[17,1,1,""],random_string:[17,1,1,""],remove_by_name:[17,1,1,""],roundup_to_integer_multiple:[17,1,1,""]},"finn.util.basic.CppBuilder":{append_includes:[17,4,1,""],append_sources:[17,4,1,""],build:[17,4,1,""],set_executable_path:[17,4,1,""]},"finn.util.data_packing":{array2hexstring:[17,1,1,""],finnpy_to_packed_bytearray:[17,1,1,""],hexstring2npbytearray:[17,1,1,""],npbytearray2hexstring:[17,1,1,""],npy_to_rtlsim_input:[17,1,1,""],numpy_to_hls_code:[17,1,1,""],pack_innermost_dim_as_hex_string:[17,1,1,""],packed_bytearray_to_finnpy:[17,1,1,""],rtlsim_output_to_npy:[17,1,1,""],unpack_innermost_dim_from_hex_string:[17,1,1,""]},"finn.util.fpgadataflow":{IPGenBuilder:[17,2,1,""],pyverilate_get_liveness_threshold_cycles:[17,1,1,""],pyverilate_stitched_ip:[17,1,1,""]},"finn.util.fpgadataflow.IPGenBuilder":{append_tcl:[17,4,1,""],build:[17,4,1,""],set_ipgen_path:[17,4,1,""]},"finn.util.onnx":{valueinfo_to_tensor:[17,1,1,""]},"finn.util.test":{get_test_model_def_fxn:[17,1,1,""],get_test_model_trained:[17,1,1,""],get_test_model_untrained:[17,1,1,""],get_trained_checkpoint:[17,1,1,""]},finn:{custom_op:[12,0,0,"-"]}},objnames:{"0":["py","module","Python module"],"1":["py","function","Python function"],"2":["py","class","Python class"],"3":["py","attribute","Python attribute"],"4":["py","method","Python method"]},objtypes:{"0":"py:module","1":"py:function","2":"py:class","3":"py:attribute","4":"py:method"},terms:{"0f01":17,"0x07":17,"0x0e":17,"0x0f01":17,"0xb":17,"0xe":17,"abstract":[12,13],"boolean":11,"class":[11,14,15,16,17],"const":14,"default":[12,13],"enum":11,"final":11,"float":17,"function":[3,11,12,13,17],"import":3,"int":15,"new":[3,4,11,12,13],"return":[9,10,11,12,13,16,17],"static":9,"throw":17,"true":[11,17],"try":3,"var":13,For:[15,16],HLS:[4,11,12,15,17],IPs:15,PEs:13,The:[3,4,8,11,12,15,16,17],There:3,Use:[11,17],abc:12,abit:17,abort:13,about:[4,7,9,15],abov:3,absolut:15,absorb1bitmulintomatmul:16,absorb:15,absorbaddintomultithreshold:16,absorbmulintomultithreshold:16,acceler:[3,15],access:3,accord:[13,17],account:11,action:15,activ:[11,17],add:[14,16,17],added:13,adder:16,adding:3,addit:[3,13,15],addition:16,address:15,admin:3,after:[13,17],aim:16,all:[3,9,11,12,13,14,15,17],all_tensors_f32:9,allow:11,alreadi:[15,19],also:[3,12,13,15],amount:17,analysi:[8,11,18],analysis_fxn:11,anaylsis_fxn:11,ani:[3,11,12,14,15,17],annot:[9,11,12,13],anoth:15,append_includ:17,append_sourc:17,append_tcl:17,appli:[11,14,15,16],appropri:[3,14],arbitrari:17,architectur:4,argument:[3,15,17],around:11,arrai:17,array2hexstr:17,arxiv:16,assign:11,associ:[11,14],assum:17,attribut:[9,12,13,15],attribute_nam:[12,13],attributeproto:[12,13],avail:19,back:[3,13],backend:15,base:[11,14,15,16,17],bash:[13,17],basic:13,batchnorm:14,batchnormtoaffin:14,been:[12,15],befor:17,below:8,between:[13,17],bias:12,binari:[11,13,15,16,17],bipolar:[11,12,13,14,16,17],bit:[11,17],bitfil:[3,12],bitwidth:11,blackbock:13,blackboxfunct:13,block:[13,15,17],blott:13,board:[11,15],bool:9,both:17,bram:13,bram_estim:13,brevita:[4,17],brien:13,browser:3,build:[13,17],built:9,calc_tmem:13,calc_wmem:13,calcul:13,calculate_signed_dot_prod_rang:17,call:[3,11,13,15],can:[3,4,7,11,13,15,16,17],centerpiec:4,chang:[3,11],check:[9,11,12,13],check_all_tensor_shapes_specifi:11,check_compat:11,client:3,clk:[13,15],clock:13,clone:[3,17],code:[13,15,17,18],code_gen_dir:17,code_gen_dir_ipgen:15,code_gen_dir_npysim:15,code_generation_ipgen:13,code_generation_npysim:13,collaps:16,collapserepeatedadd:16,collapserepeatedmul:16,collapserepeatedop:16,collect:[3,15],colloqui:4,come:[3,9],command:[3,13,17],commun:4,compar:[11,12],compare_execut:11,compare_fxn:11,comparison:12,compat:[11,12,13],compil:[4,13,17],compile_singlenode_cod:13,complet:3,compon:4,comput:[3,11,13],configur:3,consecut:16,constant:[9,11,16],construct:4,consum:11,contain:[3,4,11,12,13,15,17],context:[11,12,13],contribut:4,convert:[3,13,14,15,16,17],convertbipolarmatmultoxnorpopcount:14,convertsigntothr:16,convertsubtoadd:14,copi:[11,15],core:[8,15,18],correct:[14,17],correctli:[3,9,12,13,15],correspond:[4,11,12,13],count:13,cpp_file:17,cppbuilder:[13,17],creat:[3,11,15,17],createdataflowpartit:15,current:[4,11,13],custom:[3,4,8,9,11,15,18],customop:[12,13],cycl:[13,17],data:[11,12,13,15,17],dataflow:[4,11,15],dataoutstrm:13,datatyp:[12,13,14,17],debug:11,declar:13,deep:[4,11,13],default_v:[12,13],default_valu:[12,13],defin:13,deliveri:3,depend:3,deploi:3,deploy:15,deploytopynq:15,descript:[0,6,20,21],design:[3,15],detail:[0,4,6,7,20,21],develop:4,dict:[11,12,13],dictionari:[9,11,13],differ:[3,8,12,13],digit:17,dimens:17,dimension:17,dir:[15,17],directli:4,directori:[3,15,17],distr_pad:17,divid:8,divis:17,doc:4,docker:17,dockerfil:3,docomput:13,doe:[3,11,12],done:9,dot:17,down:[3,11],driver:15,dt_a:17,dt_b:17,dtype:[9,11,12,13,17],dynam:9,dynamic_input_to_npi:13,each:[4,9,11,14,15,16,17],editor:3,either:3,element:17,embed:11,emit:17,emphasi:4,empti:11,end:13,ensur:[13,14,15,17],entir:3,entri:17,enumer:14,environ:3,equal:[12,13],equival:16,estim:[10,13],evenli:17,event:3,everi:[3,12,13,14,15],everyth:3,exampl:[3,17],excel:3,except:17,exec_mod:15,exec_precompiled_singlenode_model:13,execut:[11,12,13,15,17],executable_path:[15,17],execute_nod:[11,12,13],execute_onnx:[11,15],execute_onnx_and_make_model:11,execution_context:11,exist:[12,13,17],exit:17,expect:[9,11,12,13,15],experi:4,experiment:4,explor:[4,11,13],expos:11,extens:3,extra:[3,9,17],extract:10,f5c6bd32ae93ec103a88152214baedff4ce1850d81065bfc:3,factor:17,factoroutmulsignmagnitud:16,fals:[11,17],familiar:3,fan:9,fast:13,feel:19,fewer:11,fewest:11,field:[15,17],file:[3,11,13,15,17],filenam:[11,15],fill:[12,13],find:[7,11],find_consum:11,find_produc:11,finish:17,finn:[0,6,7,8,19,20,21],finn_dt:17,finnpy_to_packed_bytearrai:17,first:[9,16],fix:17,flatten:17,float32:[9,11],fold:13,foldconst:14,folder:[3,15,17],follow:[3,4,9,11,12,15],form:13,format:13,forward:3,found:[4,15],four:17,fpga:[3,4],fpgadataflow:[9,12,14],fpgapart:[13,15],framework:[4,13],fraser:13,free:19,from:[3,4,10,11,13,15,17],full:11,gambardella:13,gen_finn_dt_tensor:17,gener:[4,13,15,17],generate_param:13,get:[11,12,13,15],get_all_tensor_nam:11,get_by_nam:17,get_finn_root:17,get_folded_input_shap:13,get_folded_output_shap:13,get_hls_compatible_threshold_tensor:13,get_hls_compatible_weight_tensor:13,get_hls_datatype_str:11,get_initi:11,get_input_datatyp:13,get_instream_width:13,get_metadata_prop:11,get_nodeattr:12,get_nodeattr_typ:[12,13],get_num_possible_valu:11,get_number_output_valu:13,get_output_datatyp:13,get_outstream_width:13,get_per_tensor_fanout:9,get_smallest_poss:11,get_stream_width:13,get_template_param_valu:13,get_tensor_datatyp:11,get_tensor_fanout:11,get_tensor_shap:11,get_tensor_valueinfo:11,get_test_model_def_fxn:17,get_test_model_train:17,get_test_model_untrain:17,get_trained_checkpoint:17,get_weight_datatyp:13,getcustomop:12,github:[3,4],give:[3,14,16],give_unique_node_nam:14,given:[9,10,11,12,13,17],giverandomtensornam:14,givereadabletensornam:14,giveuniquenodenam:14,global:13,global_includ:13,graph:[9,11,12,13,14,15],graphic:4,greater:12,group:12,guarante:17,guid:19,hand:4,happen:3,has:[3,9,11,13,14,15,17],have:[3,9,11,12,13,15,16],help:3,helper:12,here:[0,5,6,20,21],hex:17,hexstr:17,hexstring2npbytearrai:17,high:3,highli:4,hls:13,hls_var_nam:17,hlscustomop:13,hlslib:[4,13],homepag:4,host:[3,17],how:[6,17,21],http:3,human:14,imag:13,immedi:15,implement:[11,13,15],includ:[4,11,13,15],include_path:17,indic:[11,12,13,15],infer:[3,4,11,12,13,14,17],infer_node_datatyp:[12,13],inferbinarystreamingfclay:15,inferdatatyp:14,infershap:14,info:[14,17],info_messag:9,inform:15,infrastructur:15,initi:[3,9,11],innermost:17,inp0:12,inp1:12,inp:13,input:[9,11,12,13,14,16,17],input_dict:11,input_dtyp:17,input_fil:17,insert:[13,15,17],inserttlastmark:15,insid:[3,12],instal:3,instanc:[11,12,16],instant:17,instanti:15,instead:17,int16:11,int2:11,int32:11,int3:11,int4:11,int8:11,integ:[11,12,16,17],interest:11,interfac:15,interleav:[13,17],interleave_matrix_outer_dim_from_partit:17,intermedi:[11,14],intern:14,interv:12,involv:3,ipgen:13,ipgen_path:[15,17],ipgen_singlenode_cod:13,ipgenbuild:[13,17],is_integ:11,is_linear:9,item:17,its:12,itself:12,jupyt:[4,19],kei:11,kind:15,lab:4,lambda:11,largest:11,launch:3,layer:[14,15],lead:17,learn:[4,13],leeser:13,len:17,letter:17,librari:[4,17],library_path:17,like:3,linear:[9,11],link:[3,4,19],list:[8,9,11,17],load:17,locat:3,look:[3,4,9,19],loop:13,lut:13,lut_estim:13,made:11,magnitud:16,mai:3,make:[3,13,15],make_build_dir:17,make_collapsed_param_fxn:16,make_deepcopi:11,make_empty_exec_context:11,make_new_valueinfo_nam:11,make_project:15,make_shape_compatible_op:[12,13],makepynqdriv:15,makepynqproject:15,mani:3,manipul:11,map:12,mark:13,matmul:[14,16],matrix:[12,13,16,17],max:[11,17],mean:17,member:[12,13,17],meta:12,metadata:11,metadata_prop:[11,15],method:[12,13,20],min:[11,17],minimum:17,minut:15,mixtur:9,mkdtemp:17,mode:[3,15],model:[9,10,11,12,13,14,15,16,17,20],model_a:11,model_b:11,modelproto:[11,15],modul:18,modular:4,more:[4,7,11,14,17],mount:3,move:16,moveaddpastmul:16,movescalaraddpastmatmul:16,movescalarmulpastmatmul:16,mul:[14,16],multidimension:17,multipl:[12,16,17],multipli:16,multithreshold:[15,16],must:[12,15,16,17],mvtu:15,n_partit:17,n_thres_step:13,name:[10,11,12,14,17],name_field:17,ndarrai:17,nearest:[16,17],necessari:15,need:[10,12,13],neg:[11,16],netnam:17,netron:3,network:[3,4,13,17],neural:[4,13],neuron:13,new_nam:11,next:16,no_decl:17,node:[9,10,11,14,15,16,18],node_inputs_in_expected_ord:9,node_res_estim:13,non:15,none:[11,12,17],note:[3,12],notebook:[4,19],notwithstand:9,now:[9,11],npbytearrai:17,npbytearray2hexstr:17,npy:[13,17],npy_to_dynamic_output:13,npy_to_rtlsim_input:17,npysim:[13,15],number:[11,12,13,17],numpi:[13,17],numpy_to_hls_cod:17,object:[11,17],observ:13,old_nam:11,onc:13,one:[9,11,13,15,17],ones:[3,15],onli:[9,11,14,15,16],onlin:3,onnx:[11,12,13,15],onnx_exec:15,onnx_model_proto:11,onnx_nod:[12,13],onnxruntim:11,op_nam:16,op_typ:9,open:3,oper:[11,16],ops:[9,13,16],option:3,order:[9,11],orig_thres_matrix:13,orig_weight_matrix:13,origin:13,other:[11,16],otherwis:[3,11,12,17],out:[9,12,13],out_bia:12,out_scal:12,out_shap:17,outcom:15,outermost:17,output:[11,12,13,14,17],output_shap:17,overlai:15,overview:[4,5],own:[3,12],pack:[15,17],pack_innermost_dim:17,pack_innermost_dim_as_hex_str:17,packag:15,packed_bytearrai:17,packed_bytearray_to_finnpi:17,packedbit:17,pad:17,pad_tensor_to_multiple_of:17,pad_to_dim:17,pad_to_nbit:17,page:[7,19],pair:15,param:13,paramet:[13,16,17],part:[12,13,17],particular:[12,13,17],partit:[11,17],pass:[13,17,18],password:[3,15],past:16,path:[13,15,17],payload:3,per:15,perform:[3,12,13],permit:[12,13],place:[13,15],placehold:12,platform:15,pleas:19,point:3,popcount:12,port:3,posit:[13,16,17],possibl:[11,13,15],post:12,pragma:13,preced:16,precid:16,precis:17,precompil:13,precomput:14,prefer:11,prefix:17,prepend:17,pretrain:17,preusser:13,previous:15,print:3,prior:[14,15,17],process:[3,12],produc:[11,12,13,17],product:17,project:[4,15],properti:11,provid:[3,11],push:3,pushbutton:3,pynq:[11,15],pynq_driver_dir:15,python:[3,15,17],pytorch:17,pyveril:[11,13,17],pyverilate_get_liveness_threshold_cycl:17,pyverilate_stitched_ip:17,qnn:[3,4],quantiz:[4,9,11,13],random:[14,17],random_str:17,randomli:17,rather:3,read:[4,13],read_npy_data:13,readabl:14,real:12,recommend:14,refer:4,referenc:15,reflect:3,regular:12,rel:15,relat:[4,11,17],remot:11,remov:[15,17],remove_by_nam:17,remove_prefix:17,renam:11,rename_tensor:11,repeat:16,repeatedli:11,replac:14,replaceverilogrelpath:15,repo:[3,19],repositori:[3,4],repres:[11,17],represent:17,requir:[11,12,13],research:4,reset:13,reset_rtlsim:13,reshap:13,resourc:[3,10,13],respect:17,result:[9,10,11,14,15,16,17],return_full_exec_context:11,returned_dict:[12,13],reus:13,revers:17,reverse_endian:17,reverse_inn:17,right:13,root:[3,17],round:[16,17],roundandclipthreshold:16,roundup_to_integer_multipl:17,row:13,rtlsim:[11,13,15,17],rtlsim_output_to_npi:17,run:[11,13,15],run_dock:3,same:[15,17],sampl:13,save:[11,13,15,17],save_as_npi:13,scalar:16,scale:12,scp:15,script:[3,13,15,17],second:[15,16],see:[16,17],seen:4,sep:13,separ:[4,12],sequenc:17,server:3,servic:3,set:[3,11,12,13,15,16,17],set_executable_path:17,set_initi:11,set_ipgen_path:17,set_metadata_prop:11,set_nodeattr:12,set_tensor_datatyp:11,set_tensor_shap:11,setexecmod:15,settings64:3,sever:[3,15],shape:[11,12,13,14,17],shell:15,shortli:19,should:[3,9,11,12,13,15],sign:[11,14,16,17],sim:[13,17],simd:13,simpli:3,simul:[12,13,15,17],sinc:[11,17],singl:[3,11,13,15,16,17],slide:13,small:9,smaller:11,smallest:11,smee:3,some:[3,4,11,12,13,15],someth:3,soon:[0,5,6,7,20,21],sourc:18,spawn:3,specif:4,specifi:[11,14,15,17],split:[15,16,17],stai:4,standard:[11,12,13],stitch:[11,13,15,17],store:[12,15,17],stream:13,streamingdataflowpartit:15,streamingfclayer_batch:15,streamlin:14,string:[9,15,17],stringlength:17,strm_decl:13,style:4,sub:14,subdirectori:15,subgraph:11,submodul:18,subsequ:15,subset:9,succes:15,success:[12,15],suitabl:13,summar:13,support:11,sure:3,surviv:17,synaps:13,synthesi:[10,15],synthpynqproject:15,t_0:12,t_1:12,t_n:12,take:[3,11,16,17,19],taken:[4,11,15],target:[4,15],target_dir:15,targetbit:17,tcl:[13,15,17],tcl_script:17,tempfil:17,temporari:17,tensor:[9,11,12,14,16,17],tensor_fanout:9,tensor_nam:[9,11],tensor_shap:[11,17],tensor_valu:11,termin:[3,15],ternari:11,test:14,text:3,than:[11,12],thei:[8,16],them:[9,15,16],thi:[3,4,7,9,11,12,13,14,15,17,19],thing:4,thought:3,thresh:13,threshold:[12,13,16],through:3,time:[3,13,14,15],tlastmark:15,tmem:13,togeth:[3,15],toggl:13,toggle_clk:13,token:3,tool:[3,4],train:[3,4],transform:[8,11,18],trigger:3,tune:4,two:[4,11,12,15,16,17],type:[11,13,14,17],ubuntu:3,uint16:11,uint2:[11,17],uint32:11,uint3:11,uint4:11,uint8:[11,17],umuroglu:13,under:[4,15],uniqu:14,unpack:[15,17],unpack_innermost_dim_from_hex_str:17,unsign:[11,16],until:11,untrain:17,updat:[4,16],use:[4,15],used:[4,5,11,12,13,15,17,20,21],useful:11,user:3,usernam:[3,15],using:[11,13,14,15,16,17,19],util:[8,11,12,13,18],val:17,valu:[11,12,13,15,16,17],value_info:11,valueinfo:[11,14],valueinfo_to_tensor:17,valueinfoproto:[11,17],variabl:[3,17],vector:[16,17],verif:9,verifi:[9,12,13,20],verify_nod:[9,12,13],verilog:15,version:4,via:11,visser:13,vivado:[3,4,10,11,15,17],vivado_path:3,vivado_pynq_proj:15,vivado_stitch_proj:15,wai:[3,9],wait:17,want:16,wbit:17,webbrows:3,webhook:3,websit:4,weight:[11,13,17],welcom:4,well:3,when:[3,9,12,13],where:[3,11,12,13,15,16],wherea:11,whether:[9,11,12,13],which:[3,4,11,12,13,15,16,17],width:[13,17],window:13,without:3,wmem:13,work:[3,6,11,17],workspac:3,wrapper:11,write:[3,12,13],xilinx:4,xnor:12,xnorpopcountmatmul:[12,14,15],you:[3,7],your:3,zero:[11,13,16,17]},titles:["Brevitas Export","End-to-End Flow","Index","Getting Started","FINN","Internals","Network Preparation","PYNQ Deployment","Source Code","Analysis","Analysis - fpgadataflow","Core","Custom Op","Custom Op - FPGADataFlow","Transformation","Transformation - fpgadataflow","Transformation - Streamline","Util","finn","Tutorials","Functional Verification","Vivado HLS and Vivado Synthesis"],titleterms:{"class":[12,13],"export":0,"function":20,HLS:[13,21],absorb:16,analysi:[5,9,10],base:[12,13],basic:17,batchnorm_to_affin:14,bipolar_to_xnor:14,brevita:0,cleanup:15,code:8,codegen_ipgen:15,codegen_ipstitch:15,codegen_npysim:15,collapse_rep:16,compil:[3,15],convert_to_hls_lay:15,convolutioninputgener:13,core:11,create_dataflow_partit:15,custom:[12,13],custom_op:[12,13],data_pack:17,datatyp:11,deploy:7,develop:3,directli:3,docker:3,end:1,execute_custom_nod:11,experiment:3,finn:[3,4,5,9,10,11,12,13,14,15,16,17,18],flow:1,fold_const:14,fpgadataflow:[10,13,15,17],gener:14,get:3,hls_synth_res_estim:10,hlssynth_ipgen:15,how:3,index:2,infer_datatyp:14,infer_shap:14,insert_tlastmark:15,interact:3,intermedi:5,intern:5,jenkin:3,jupyt:3,make_deploy:15,make_pynq_driv:15,make_pynq_proj:15,modelwrapp:[5,11],modul:[8,11,17],multithreshold:12,network:6,node:[12,13],notebook:3,onnx:[5,17],onnx_exec:11,pass:[5,9,10,14],prepar:6,pynq:7,registri:12,remote_exec:11,reorder:16,replace_verilog_relpath:15,represent:5,requir:3,res_estim:10,round_threshold:16,rtlsim_exec:11,run:3,set_exec_mod:15,shell:3,sign_to_thr:16,sourc:8,start:3,streamingdataflowpartit:12,streamingfclayer_batch:13,streamingmaxpool_batch:13,streamlin:16,submodul:[9,12,14],suit:3,synth_pynq_proj:15,synthesi:21,templat:[13,15],test:[3,17],tlastmark:13,topolog:9,transform:[5,14,15,16],tutori:19,use:3,using:3,util:17,verif:20,verify_custom_nod:9,vivado:21,what:4,xnorpopcount:12}})